export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export const SIZE_UNITS = ["in", "cm"] as const;
/** Square centimetres per square inch; used to compare cm and inch sizes by area. */
export const CM2_PER_IN2 = 6.4516;

/** Max lengths (characters) for admin frame form fields. */
export const FRAME_NAME_MAX_LENGTH = 120;
export const FRAME_DESCRIPTION_MAX_LENGTH = 2000;
export const FRAME_MATERIAL_MAX_LENGTH = 60;
export const FRAME_COLOR_MAX_LENGTH = 60;
export const FRAME_IMAGE_URL_MAX_LENGTH = 2000;
export const SIZE_LABEL_MAX_LENGTH = 40;

export const MAX_SIZES_PER_FRAME = 30;
export const MAX_SIZE_DIMENSION = 9999;
export const MAX_SIZE_PRICE = 99_999_999;

/** Orders shown on the admin dashboard. */
export const RECENT_ORDERS_LIMIT = 5;
/** Page size for the order list on the admin user-detail view. */
export const USER_ORDERS_PAGE_SIZE = 10;
