import type { CONTACT_TYPES } from "../constants/auth";

export type UserRole = "customer" | "admin";

export type ContactType = (typeof CONTACT_TYPES)[number];

export interface User {
  id: number;
  username: string;
  email: string | null;
  mobile: string | null;
  role: UserRole;
  createdAt: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  contactType: ContactType;
  contact: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export type StrengthLevel = 0 | 1 | 2 | 3 | 4;

export interface PasswordStrength {
  level: StrengthLevel;
  label: string;
}

/** `location.state` set when a protected page redirects to /login. */
export interface RedirectState {
  from?: string;
}

/** The JWT claims the client reads (only `exp`, to skip sending an expired token). */
export interface JwtClaims {
  exp?: number;
}
