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
