/** Delay after the last keystroke before a list search runs. */
export const SEARCH_DEBOUNCE_MS = 400;

/** Must match the 900px breakpoint where the navbar collapses (App.css). */
export const NAV_DESKTOP_MEDIA_QUERY = "(min-width: 901px)";

export const DEFAULT_PAGE_SIZE = 20;

export const LOCALE = "en-US";
export const DATE_LOCALE = "en-GB";
export const CURRENCY = "USD";

/** Logo: 13 kB WebP (37 kB on high-DPI screens). */
export const LOGO = {
  src: "/logo-170.webp",
  srcSet: "/logo-170.webp 1x, /logo-340.webp 2x",
  width: 171,
  height: 170,
} as const;
export const BRAND_NAME = "FrameCraft";

/** Requests past this page number are clamped. */
export const MAX_LIST_PAGE = 100_000;

/** Scroll reveal: start a little before the element enters the screen. */
export const REVEAL_ROOT_MARGIN = "0px 0px -10% 0px";
export const REVEAL_THRESHOLD = 0.15;

/** How long a toast stays up (it pauses while hovered). Errors stay a little longer. */
export const TOAST_DURATION_MS = 4000;
export const ERROR_TOAST_DURATION_MS = 6000;
/** At most this many toasts are shown at once; older ones are dropped. */
export const MAX_TOASTS = 4;

/** Placeholder rows shown while a list loads for the first time. */
export const SKELETON_ROWS = 6;
/** Length of the row "slide out" animation after a delete (keep in sync with admin.css). */
export const ROW_REMOVE_ANIMATION_MS = 400;

/** Icon sizes (px) for lucide icons, so every icon of a kind matches. */
export const ICON_SIZE = {
  xs: 12,
  sm: 14,
  action: 15,
  md: 16,
  lg: 18,
  xl: 20,
  menu: 22,
} as const;

/** Shown wherever a value is missing (no email, no material, …). */
export const EMPTY_VALUE = "—";

/** Admin list search box: longer input is cut off (the server caps it too). */
export const SEARCH_MAX_LENGTH = 100;

/** Logo in the admin top bar (px). */
export const ADMIN_LOGO_SIZE = 40;
/** Frame thumbnail in the frames list (px). */
export const FRAME_THUMB_SIZE = 44;

/** Columns in every admin list table — the skeleton shows the same number. */
export const ADMIN_TABLE_COLUMNS = 6;
/** Placeholder rows for the dashboard's recent-orders table. */
export const DASHBOARD_SKELETON_ROWS = 5;

/** whenIdle(): run within this long even if the browser never goes idle. */
export const IDLE_TIMEOUT_MS = 2000;
/** whenIdle() fallback delay for browsers without requestIdleCallback. */
export const IDLE_FALLBACK_MS = 200;

/** Scroll-reveal cascade: cards fade in in groups of this many. */
export const REVEAL_STEPS = 4;
