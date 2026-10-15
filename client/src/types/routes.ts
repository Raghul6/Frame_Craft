import type { ComponentType, LazyExoticComponent } from "react";
import type { UserRole } from "./auth";

/** One protected page in routes/routes.ts (Symphony-style route config). */
export interface AppRoute {
  path: string;
  name: string;
  /** Roles allowed to open the page. */
  roles: readonly UserRole[];
  component: ComponentType;
}

export type PreloadableComponent<P extends object> = LazyExoticComponent<
  ComponentType<P>
> & {
  /** Starts downloading the component's chunk without rendering it. */
  preload: () => Promise<{ default: ComponentType<P> }>;
};
