import type { NextFunction, Request, Response } from "express";
import {
  ORDER_STATUSES,
  RECENT_ORDERS_LIMIT,
  USER_ORDERS_PAGE_SIZE,
} from "../constants/admin.js";
import * as Dashboard from "../models/dashboard.model.js";
import * as Frames from "../models/frame.model.js";
import * as Orders from "../models/order.model.js";
import * as Users from "../models/user.model.js";
import type { DashboardStats, OrderStatus } from "../types/admin.js";
import type { UserRole } from "../types/auth.js";
import { isUniqueViolation } from "../utils/dbErrors.js";
import { validateFrame } from "../utils/frameValidators.js";
import { HttpError } from "../utils/httpError.js";
import { getPageParams, parseId, queryString } from "../utils/pagination.js";

const requireId = (req: Request) => {
  const id = parseId(req.params.id);
  if (!id) throw new HttpError(400, "Invalid id");
  return id;
};

const isOrderStatus = (value: unknown): value is OrderStatus =>
  ORDER_STATUSES.includes(value as OrderStatus);

// ---------- Dashboard ----------

export async function getDashboard(
  _req: Request,
  res: Response<DashboardStats>,
  next: NextFunction,
) {
  try {
    const [stats, recent] = await Promise.all([
      Dashboard.getDashboardStats(),
      Orders.recentOrders(RECENT_ORDERS_LIMIT),
    ]);
    res.json({
      customers: stats.customers,
      frames: stats.frames,
      orders: stats.orders,
      pendingOrders: stats.pending,
      revenue: stats.revenue,
      recentOrders: recent,
    });
  } catch (err) {
    next(err);
  }
}

// ---------- Users ----------

export async function listUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const role = queryString(req.query.role);
    res.json(
      await Users.listUsers(
        {
          search: queryString(req.query.search),
          role:
            role === "admin" || role === "customer" ? (role as UserRole) : "",
        },
        getPageParams(req.query),
      ),
    );
  } catch (err) {
    next(err);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = requireId(req);
    // Both queries run in parallel; the orders are simply dropped if the user doesn't exist.
    const [user, orders] = await Promise.all([
      Users.findAdminUserById(id),
      Orders.listOrders(
        { status: "", search: "", userId: id },
        getPageParams(req.query, USER_ORDERS_PAGE_SIZE),
      ),
    ]);
    if (!user) throw new HttpError(404, "User not found");
    res.json({ user, orders });
  } catch (err) {
    next(err);
  }
}

// ---------- Orders ----------

export async function listOrders(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const status = queryString(req.query.status);
    res.json(
      await Orders.listOrders(
        {
          status: isOrderStatus(status) ? status : "",
          search: queryString(req.query.search),
        },
        getPageParams(req.query),
      ),
    );
  } catch (err) {
    next(err);
  }
}

export async function getOrder(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const order = await Orders.findOrderById(requireId(req));
    if (!order) throw new HttpError(404, "Order not found");
    res.json({ order });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = requireId(req);
    const status = req.body?.status;
    if (!isOrderStatus(status)) {
      throw new HttpError(
        400,
        `Status must be one of: ${ORDER_STATUSES.join(", ")}`,
      );
    }
    if (!(await Orders.updateOrderStatus(id, status)))
      throw new HttpError(404, "Order not found");
    res.json({ order: await Orders.findOrderById(id) });
  } catch (err) {
    next(err);
  }
}

// ---------- Frames ----------

export async function listFrames(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const status = queryString(req.query.status);
    res.json(
      await Frames.listFrames(
        {
          search: queryString(req.query.search),
          status: status === "active" || status === "inactive" ? status : "",
        },
        getPageParams(req.query),
      ),
    );
  } catch (err) {
    next(err);
  }
}

export async function getFrame(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const frame = await Frames.findFrameById(requireId(req));
    if (!frame) throw new HttpError(404, "Frame not found");
    res.json({ frame });
  } catch (err) {
    next(err);
  }
}

const parseFrameBody = (req: Request) => {
  const { errors, data } = validateFrame(req.body ?? {});
  if (Object.keys(errors).length)
    throw new HttpError(400, "Please fix the highlighted fields", errors);
  return data;
};

const duplicateSize = () =>
  new HttpError(409, "Two sizes have the same width, height and unit");

export async function createFrame(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = parseFrameBody(req);
    res.status(201).json({ frame: await Frames.createFrame(data) });
  } catch (err) {
    next(isUniqueViolation(err) ? duplicateSize() : err);
  }
}

export async function updateFrame(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = requireId(req);
    const data = parseFrameBody(req);
    const frame = await Frames.updateFrame(id, data);
    if (!frame) throw new HttpError(404, "Frame not found");
    res.json({ frame });
  } catch (err) {
    next(isUniqueViolation(err) ? duplicateSize() : err);
  }
}

export async function deleteFrame(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!(await Frames.deleteFrame(requireId(req))))
      throw new HttpError(404, "Frame not found");
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
