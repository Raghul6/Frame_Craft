import type { LucideIcon } from "lucide-react";
import type { ORDER_STATUSES, SIZE_UNITS } from "../constants/admin";
import type { UserRole } from "./auth";
import type { Paginated } from "./api";

export type SizeUnit = (typeof SIZE_UNITS)[number];

export type OrderStatus = (typeof ORDER_STATUSES)[number];

interface FrameSize {
  id: number;
  label: string;
  width: number;
  height: number;
  unit: SizeUnit;
  price: number;
  stock: number;
}

export interface Frame {
  id: number;
  name: string;
  description: string;
  material: string;
  color: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sizes: FrameSize[];
}

/** What the frame form sends. Numbers may still be strings straight from inputs. */
interface FrameSizeInput {
  id?: number;
  label: string;
  width: number | string;
  height: number | string;
  unit: SizeUnit;
  price: number | string;
  stock: number | string;
}

export interface FrameInput {
  name: string;
  description: string;
  material: string;
  color: string;
  imageUrl: string;
  isActive: boolean;
  sizes: FrameSizeInput[];
}

export interface AdminUser {
  id: number;
  username: string;
  email: string | null;
  mobile: string | null;
  role: UserRole;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export interface OrderSummary {
  id: number;
  status: OrderStatus;
  total: number;
  itemCount: number;
  createdAt: string;
  customer: { id: number; username: string };
}

interface OrderItem {
  id: number;
  frameId: number | null;
  frameSizeId: number | null;
  frameName: string;
  sizeLabel: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderDetail extends Omit<OrderSummary, "customer"> {
  updatedAt: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  customer: {
    id: number;
    username: string;
    email: string | null;
    mobile: string | null;
  };
  items: OrderItem[];
}

export interface DashboardStats {
  customers: number;
  frames: number;
  orders: number;
  pendingOrders: number;
  revenue: number;
  recentOrders: OrderSummary[];
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface AdminNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Only active on an exact URL match (for the dashboard index route). */
  end: boolean;
}

export interface SizePreset {
  width: number;
  height: number;
  unit: SizeUnit;
  /** Label saved with the size; defaults to "W x H unit". */
  label?: string;
  /** Text on the quick-add chip; defaults to "W×H″". */
  short?: string;
}

export interface DashboardStatCard {
  key: Exclude<keyof DashboardStats, "recentOrders">;
  label: string;
  icon: LucideIcon;
  to: string;
  /** Format the value as currency. */
  money?: boolean;
}

/** GET /admin/users/:id */
export interface UserDetailResponse {
  user: AdminUser;
  orders: Paginated<OrderSummary>;
}

/** GET /admin/orders/:id and PATCH /admin/orders/:id/status */
export interface OrderDetailResponse {
  order: OrderDetail;
}

/** GET/POST/PUT /admin/frames[/:id] */
export interface FrameResponse {
  frame: Frame;
}
