// Keep these rules in sync with client/src/utils/validators.ts on the frontend.
import {
  EMAIL_REGEX,
  MOBILE_REGEX,
  PASSWORD_MAX_BYTES,
  PASSWORD_MIN_LENGTH,
  USERNAME_REGEX,
} from "../constants/auth.js";
import type {
  FieldErrors,
  LoginInput,
  RegisterInput,
  ValidationResult,
} from "../types/auth.js";

const normalizeMobile = (value: string) => value.replace(/[\s-]/g, "");

const asString = (value: unknown) => (typeof value === "string" ? value : "");

export function getPasswordErrors(password: string): string[] {
  const errors: string[] = [];
  if (password.length < PASSWORD_MIN_LENGTH)
    errors.push(`at least ${PASSWORD_MIN_LENGTH} characters`);
  if (Buffer.byteLength(password, "utf8") > PASSWORD_MAX_BYTES)
    errors.push(
      `at most ${PASSWORD_MAX_BYTES} bytes (fewer characters if you use non-English letters)`,
    );
  if (!/[a-z]/.test(password)) errors.push("a lowercase letter");
  if (!/[A-Z]/.test(password)) errors.push("an uppercase letter");
  if (!/\d/.test(password)) errors.push("a number");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("a special character");
  return errors;
}

export function validateRegister(
  body: Record<string, unknown>,
): ValidationResult<RegisterInput> {
  const errors: FieldErrors = {};
  const username = asString(body.username).trim();
  const contactType = body.contactType;
  const rawContact = asString(body.contact).trim();
  const password = asString(body.password);

  if (!USERNAME_REGEX.test(username)) {
    errors.username =
      "Username must be 3–30 characters: letters, numbers, _ or .";
  }

  let email: string | null = null;
  let mobile: string | null = null;
  if (contactType === "email") {
    email = rawContact.toLowerCase();
    if (!EMAIL_REGEX.test(email))
      errors.contact = "Enter a valid email address";
  } else if (contactType === "mobile") {
    mobile = normalizeMobile(rawContact);
    if (!MOBILE_REGEX.test(mobile))
      errors.contact = "Enter a valid mobile number (10–15 digits)";
  } else {
    errors.contact = "Provide an email address or mobile number";
  }

  const pwErrors = getPasswordErrors(password);
  if (pwErrors.length)
    errors.password = `Password needs ${pwErrors.join(", ")}`;

  return { errors, data: { username, email, mobile, password } };
}

export function validateLogin(
  body: Record<string, unknown>,
): ValidationResult<LoginInput> {
  const errors: FieldErrors = {};
  const username = asString(body.username).trim();
  const password = asString(body.password);
  if (!username) errors.username = "Username is required";
  if (!password) errors.password = "Password is required";
  return { errors, data: { username, password } };
}
