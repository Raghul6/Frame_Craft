import type { ORDER_STATUSES, SIZE_UNITS } from "../constants/admin.js";
import type { UserRole } from "./auth.js";

export type SizeUnit = (typeof SIZE_UNITS)[number];

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

export interface PageParams {
  page: number;
  limit: number;
  offset: number;
}

export interface FrameSize {
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
  createdAt: Date;
  updatedAt: Date;
  sizes: FrameSize[];
}

export interface FrameSizeInput {
  id?: number;
  label: string;
  width: number;
  height: number;
  unit: SizeUnit;
  price: number;
  stock: number;
}

export interface FrameInput {
  name: string;
  description: string;
  material: string;
  color: string;
  imageUrl: string | null;
  isActive: boolean;
  sizes: FrameSizeInput[];
}

export interface AdminUserSummary {
  id: number;
  username: string;
  email: string | null;
  mobile: string | null;
  role: UserRole;
  createdAt: Date;
  orderCount: number;
  totalSpent: number;
}

export interface OrderSummary {
  id: number;
  status: OrderStatus;
  total: number;
  itemCount: number;
  createdAt: Date;
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
  updatedAt: Date;
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

// ---------- List filters ----------

export interface FrameFilters {
  search: string;
  status: "active" | "inactive" | "";
}

export interface OrderFilters {
  status: OrderStatus | "";
  /** Matches an order number (e.g. "42" or "#42") or a customer username. */
  search: string;
  userId?: number;
}

export interface UserFilters {
  search: string;
  role: UserRole | "";
}
