import type { UserRole } from "../types/auth";

export const PATHS = {
  home: "/",
  login: "/login",
  register: "/register",

  admin: {
    root: "/admin",
    orders: "/admin/orders",
    orderDetail: (id: number | string = ":id") => `/admin/orders/${id}`,
    frames: "/admin/frames",
    newFrame: "/admin/frames/new",
    editFrame: (id: number | string = ":id") => `/admin/frames/${id}`,
    users: "/admin/users",
    userDetail: (id: number | string = ":id") => `/admin/users/${id}`,
  },
};

/** Only same-app paths ("/x"), never "//evil.com" or "https://…" — blocks open redirects. */
const isSafeInternalPath = (path: unknown): path is string =>
  typeof path === "string" && /^\/(?!\/)/.test(path);

const isAdminPath = (path: string) =>
  path === PATHS.admin.root || path.startsWith(`${PATHS.admin.root}/`);

/**
 * Where a user lands after logging in. Admins go to the admin panel (or the admin
 * page they were trying to open); customers go back to where they were, never /admin.
 */
export const getPostLoginPath = (role: UserRole, from?: unknown): string => {
  const target = isSafeInternalPath(from) ? from : null;
  if (role === "admin")
    return target && isAdminPath(target) ? target : PATHS.admin.root;
  return target && !isAdminPath(target) ? target : PATHS.home;
};
