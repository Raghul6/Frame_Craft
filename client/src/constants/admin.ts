import {
  Clock,
  DollarSign,
  Frame,
  LayoutDashboard,
  ShoppingBag,
  Users,
} from "lucide-react";
import type {
  AdminNavItem,
  DashboardStatCard,
  FilterOption,
  SizePreset,
} from "../types/admin";
import { PATHS } from "../routes/paths";
import { capitalize } from "../utils/text";

// Keep in sync with server/src/constants/admin.ts.
export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export const SIZE_UNITS = ["in", "cm"] as const;

export const FRAME_FIELD_LIMITS = {
  name: 120,
  material: 60,
  color: 60,
  label: 40,
  description: 2000,
  imageUrl: 2000,
} as const;

/** Frame images must be https (no mixed-content warnings on the https site). */
export const IMAGE_URL_REGEX = /^https:\/\/\S+$/i;

/** Placeholder shown in a size row's label box when it can't be derived yet. */
export const SIZE_LABEL_PLACEHOLDER = "Label";

export const ADMIN_NAV: readonly AdminNavItem[] = [
  {
    to: PATHS.admin.root,
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  { to: PATHS.admin.orders, label: "Orders", icon: ShoppingBag, end: false },
  { to: PATHS.admin.frames, label: "Frames", icon: Frame, end: false },
  { to: PATHS.admin.users, label: "Users", icon: Users, end: false },
];

export const ORDER_STATUS_OPTIONS: readonly FilterOption[] = ORDER_STATUSES.map(
  (s) => ({
    value: s,
    label: capitalize(s),
  }),
);

export const ORDER_FILTER_OPTIONS: readonly FilterOption[] = [
  { value: "", label: "All statuses" },
  ...ORDER_STATUS_OPTIONS,
];

export const ROLE_FILTER_OPTIONS: readonly FilterOption[] = [
  { value: "", label: "All roles" },
  { value: "customer", label: "Customers" },
  { value: "admin", label: "Admins" },
];

export const FRAME_STATUS_OPTIONS: readonly FilterOption[] = [
  { value: "", label: "All frames" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Hidden" },
];

/** One-click sizes on the frame form. */
export const FRAME_SIZE_PRESETS: readonly SizePreset[] = [
  { width: 4, height: 6, unit: "in" },
  { width: 5, height: 7, unit: "in" },
  { width: 8, height: 10, unit: "in" },
  { width: 8.5, height: 11, unit: "in" },
  { width: 11, height: 14, unit: "in" },
  { width: 12, height: 16, unit: "in" },
  { width: 16, height: 20, unit: "in" },
  { width: 18, height: 24, unit: "in" },
  { width: 24, height: 36, unit: "in" },
  {
    width: 21,
    height: 29.7,
    unit: "cm",
    label: "A4 (21 x 29.7 cm)",
    short: "A4",
  },
  {
    width: 29.7,
    height: 42,
    unit: "cm",
    label: "A3 (29.7 x 42 cm)",
    short: "A3",
  },
];

export const DEFAULT_SIZE_UNIT = "in" as const;
export const DEFAULT_SIZE_STOCK = "0";
/** Width / height / price / stock inputs never need more characters than this. */
export const SIZE_NUMBER_MAX_LENGTH = 12;

export const DASHBOARD_STAT_CARDS: readonly DashboardStatCard[] = [
  {
    key: "revenue",
    label: "Revenue",
    icon: DollarSign,
    to: PATHS.admin.orders,
    money: true,
  },
  { key: "orders", label: "Orders", icon: ShoppingBag, to: PATHS.admin.orders },
  {
    key: "pendingOrders",
    label: "Pending orders",
    icon: Clock,
    to: `${PATHS.admin.orders}?status=pending`,
  },
  {
    key: "customers",
    label: "Customers",
    icon: Users,
    to: `${PATHS.admin.users}?role=customer`,
  },
  { key: "frames", label: "Frames", icon: Frame, to: PATHS.admin.frames },
];

export const RECENT_ORDERS_EMPTY_TEXT = "No orders yet.";
