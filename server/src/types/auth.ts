export type UserRole = "customer" | "admin";

/** User shape returned by the API (matches client/src/types/auth.ts). */
export interface PublicUser {
  id: number;
  username: string;
  email: string | null;
  mobile: string | null;
  role: UserRole;
  createdAt: Date;
}

export interface AuthContext {
  userId: number;
  role: UserRole;
}

export type FieldErrors = Partial<Record<string, string>>;

export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  email: string | null;
  mobile: string | null;
  password: string;
}

export interface CreateCustomerInput {
  username: string;
  email: string | null;
  mobile: string | null;
  passwordHash: string;
}

export interface ValidationResult<T> {
  errors: FieldErrors;
  data: T;
}

/** Who is calling and from where — stored with each refresh token. */
export interface SessionMeta {
  userAgent: string | null;
  ip: string | null;
}

export interface NewRefreshToken {
  userId: number;
  familyId: string;
  tokenHash: string;
  expiresAt: Date;
  userAgent: string | null;
  ip: string | null;
}

/** A signed-in session: the access token for the body, the refresh token for the cookie. */
export interface Session {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
}

/** Which roles may call the APIs mounted under `prefix` (see ROUTE_ROLE_ACCESS). */
export interface RouteAccessRule {
  prefix: string;
  roles: readonly UserRole[];
}
