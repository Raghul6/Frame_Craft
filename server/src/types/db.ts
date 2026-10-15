// Raw row shapes returned by PostgreSQL (snake_case columns).
import type { FrameSize, OrderStatus } from "./admin.js";
import type { UserRole } from "./auth.js";

/** Row shape of the `users` table. */
interface UserRow {
  id: number;
  username: string;
  email: string | null;
  mobile: string | null;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export type PublicUserRow = Omit<UserRow, "password_hash" | "updated_at">;

/** What the login query selects: the public columns plus the hash to compare against. */
export type LoginUserRow = PublicUserRow & Pick<UserRow, "password_hash">;

/** `create-admin` upsert result; `created` is false when an existing user was promoted. */
export type UpsertAdminRow = PublicUserRow & { created: boolean };

/** Which of username / email / mobile are already taken (null when no row matched). */
export interface Conflicts {
  username: boolean | null;
  email: boolean | null;
  mobile: boolean | null;
}

export interface AdminUserRow extends PublicUserRow {
  order_count: number;
  total_spent: number;
}

export interface FrameRow {
  id: number;
  name: string;
  description: string;
  material: string;
  color: string;
  image_url: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  sizes: FrameSize[];
}

export interface OrderSummaryRow {
  id: number;
  status: OrderStatus;
  total: number;
  item_count: number;
  created_at: Date;
  user_id: number;
  username: string;
}

export interface OrderDetailRow extends OrderSummaryRow {
  updated_at: Date;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  email: string | null;
  mobile: string | null;
}

export interface OrderItemRow {
  id: number;
  frame_id: number | null;
  frame_size_id: number | null;
  frame_name: string;
  size_label: string;
  unit_price: number;
  quantity: number;
}

/** Any list row that carries `COUNT(*) OVER () AS total_count`. */
export interface CountedRow {
  total_count: number;
}

export interface DashboardStatsRow {
  customers: number;
  frames: number;
  orders: number;
  pending: number;
  revenue: number;
}

export interface RefreshTokenRow {
  id: number;
  user_id: number;
  family_id: string;
  expires_at: Date;
  revoked_at: Date | null;
}

/** Just enough of a user to authorise a request. */
export interface AuthUserRow {
  id: number;
  role: UserRole;
}
