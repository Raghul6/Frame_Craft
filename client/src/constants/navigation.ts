import { PATHS } from "../routes/paths";
import type { StoreNavLink } from "../types/home";

/** Home-page section anchors used by the navbar. */
export const HOME_SECTIONS = {
  shop: "shop",
  gallery: "gallery",
  howItWorks: "how-it-works",
  products: "most-loved",
  reviews: "stories",
} as const;

export const STORE_NAV_LINKS: readonly StoreNavLink[] = [
  { label: "Shop frames", href: `${PATHS.home}#${HOME_SECTIONS.shop}` },
  { label: "Gallery walls", href: `${PATHS.home}#${HOME_SECTIONS.gallery}` },
  { label: "How it works", href: `${PATHS.home}#${HOME_SECTIONS.howItWorks}` },
];
