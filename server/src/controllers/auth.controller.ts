import bcrypt from "bcryptjs";
import type { NextFunction, Request, Response } from "express";
import {
  DUMMY_PASSWORD,
  SALT_ROUNDS,
  USER_AGENT_MAX_LENGTH,
} from "../constants/auth.js";
import * as Users from "../models/user.model.js";
import {
  endSession,
  refreshSession,
  startSession,
} from "../services/session.service.js";
import type { FieldErrors, Session, SessionMeta } from "../types/auth.js";
import {
  clearRefreshCookie,
  readRefreshCookie,
  setRefreshCookie,
} from "../utils/cookies.js";
import { isUniqueViolation } from "../utils/dbErrors.js";
import { HttpError } from "../utils/httpError.js";
import { validateLogin, validateRegister } from "../utils/validators.js";

// Compared against when the username doesn't exist, so response time doesn't reveal valid usernames.
const DUMMY_HASH = bcrypt.hashSync(DUMMY_PASSWORD, SALT_ROUNDS);

const ensureValid = (errors: FieldErrors) => {
  if (Object.keys(errors).length) {
    throw new HttpError(400, "Please fix the highlighted fields", errors);
  }
};

const sessionMeta = (req: Request): SessionMeta => ({
  userAgent: req.get("user-agent")?.slice(0, USER_AGENT_MAX_LENGTH) ?? null,
  ip: req.ip ?? null,
});

/** Refresh token → httpOnly cookie; access token + user → JSON body. */
const sendSession = (res: Response, session: Session, status = 200) => {
  setRefreshCookie(res, session.refreshToken, session.refreshExpiresAt);
  res.status(status).json({ token: session.accessToken, user: session.user });
};

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { errors, data } = validateRegister(req.body ?? {});
    ensureValid(errors);

    const conflicts = await Users.findConflicts(data);
    const fieldErrors: FieldErrors = {};
    if (conflicts.username)
      fieldErrors.username = "This username is already taken";
    if (conflicts.email)
      fieldErrors.contact = "An account with this email already exists";
    if (conflicts.mobile)
      fieldErrors.contact = "An account with this mobile number already exists";
    if (Object.keys(fieldErrors).length) {
      throw new HttpError(409, "Account already exists", fieldErrors);
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
    const row = await Users.createCustomer({ ...data, passwordHash });
    sendSession(
      res,
      await startSession(Users.toPublicUser(row), sessionMeta(req)),
      201,
    );
  } catch (err) {
    // A unique-index race (two sign-ups with the same name at once) still reports a clean 409.
    next(
      isUniqueViolation(err)
        ? new HttpError(409, "Account already exists")
        : err,
    );
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { errors, data } = validateLogin(req.body ?? {});
    ensureValid(errors);

    const row = await Users.findByUsername(data.username);
    const ok = await bcrypt.compare(
      data.password,
      row?.password_hash ?? DUMMY_HASH,
    );
    if (!row || !ok) throw new HttpError(401, "Invalid username or password");

    sendSession(
      res,
      await startSession(Users.toPublicUser(row), sessionMeta(req)),
    );
  } catch (err) {
    next(err);
  }
}

/** Swaps the refresh cookie for a new access token (and a rotated cookie). */
export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = readRefreshCookie(req);
    if (!token)
      throw new HttpError(401, "Session expired, please log in again");
    sendSession(res, await refreshSession(token, sessionMeta(req)));
  } catch (err) {
    if (err instanceof HttpError && err.status === 401) clearRefreshCookie(res);
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const token = readRefreshCookie(req);
    if (token) await endSession(token);
    clearRefreshCookie(res);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const row = req.auth ? await Users.findById(req.auth.userId) : null;
    if (!row) throw new HttpError(401, "Account no longer exists");
    res.json({ user: Users.toPublicUser(row) });
  } catch (err) {
    next(err);
  }
}
