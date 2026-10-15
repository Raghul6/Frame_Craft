import type { ComponentType, LazyExoticComponent, ReactNode } from "react";
import type { UserRole } from "./auth";

export interface RouteConfig {
  path?: string;
  index?: boolean;
  element: ReactNode;
  /** Empty = any signed-in user. */
  requiredRoles: UserRole[];
}

export type PreloadableComponent<P extends object> = LazyExoticComponent<
  ComponentType<P>
> & {
  /** Starts downloading the component's chunk without rendering it. */
  preload: () => Promise<{ default: ComponentType<P> }>;
};
