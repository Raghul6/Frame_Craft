// Keep these rules in sync with server/src/constants/auth.ts.
import type { PasswordRule } from "../types/auth";

export const USERNAME_REGEX = /^[a-zA-Z0-9_.]{3,30}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Optional +, then 10–15 digits (spaces/dashes are stripped first). */
export const MOBILE_REGEX = /^\+?\d{10,15}$/;
export const MOBILE_SEPARATORS_REGEX = /[\s-]/g;

export const USERNAME_MAX_LENGTH = 30;
/** Matches the users.email column (VARCHAR 255). */
export const CONTACT_MAX_LENGTH = 255;
const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;

export const PASSWORD_RULES: readonly PasswordRule[] = [
  {
    id: "length",
    label: `At least ${PASSWORD_MIN_LENGTH} characters`,
    test: (p) => p.length >= PASSWORD_MIN_LENGTH,
  },
  { id: "lower", label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { id: "upper", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { id: "number", label: "One number", test: (p) => /\d/.test(p) },
  {
    id: "special",
    label: "One special character",
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

export const STRENGTH_LABELS = [
  "Too weak",
  "Weak",
  "Fair",
  "Good",
  "Strong",
] as const;
/** Passwords this long (and meeting most rules) score one level higher. */
export const STRENGTH_LONG_PASSWORD = 14;
/** Passwords shorter than this never score above "Weak". */
export const STRENGTH_SHORT_PASSWORD = 6;
/** Number of bars in the strength meter. */
export const STRENGTH_BARS = [1, 2, 3, 4] as const;

/** Input settings for each way of signing up. */
export const CONTACT_FIELDS = {
  email: {
    tab: "Email",
    label: "Email address",
    type: "email",
    inputMode: "email",
    autoComplete: "email",
    placeholder: "you@example.com",
  },
  mobile: {
    tab: "Mobile number",
    label: "Mobile number",
    type: "tel",
    inputMode: "tel",
    autoComplete: "tel",
    placeholder: "+91 98765 43210",
  },
} as const;

export const CONTACT_TYPES = ["email", "mobile"] as const;
