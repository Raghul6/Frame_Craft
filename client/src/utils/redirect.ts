import type { UserRole } from "../types/auth";

/** Only same-app paths ("/x"), never "//evil.com" or "https://…" — blocks open redirects. */
const isSafeInternalPath = (path: unknown): path is string =>
  typeof path === "string" && /^\/(?!\/)/.test(path);

const isAdminPath = (path: string) =>
  path === "/admin" || path.startsWith("/admin/");

/**
 * Where a user lands after logging in. Admins go to the admin panel (or the admin page
 * they were trying to open); customers go back to where they were, never /admin.
 */
export const getPostLoginPath = (role: UserRole, from?: unknown): string => {
  const target = isSafeInternalPath(from) ? from : null;
  if (role === "admin")
    return target && isAdminPath(target) ? target : "/admin";
  return target && !isAdminPath(target) ? target : "/";
};
