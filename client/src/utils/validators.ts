// Keep these rules in sync with server/src/utils/validators.ts.
import {
  EMAIL_REGEX,
  MOBILE_REGEX,
  MOBILE_SEPARATORS_REGEX,
  PASSWORD_MAX_LENGTH,
  PASSWORD_RULES,
  USERNAME_REGEX,
} from "../constants/auth";
import type { ContactType } from "../types/auth";

export const isStrongPassword = (password: string) =>
  password.length <= PASSWORD_MAX_LENGTH &&
  PASSWORD_RULES.every((rule) => rule.test(password));

export function validateUsername(value: string): string | undefined {
  if (!value.trim()) return "Username is required";
  if (!USERNAME_REGEX.test(value.trim()))
    return "3–30 characters: letters, numbers, _ or .";
}

export function validateContact(
  type: ContactType,
  value: string,
): string | undefined {
  const trimmed = value.trim();
  if (type === "email") {
    if (!trimmed) return "Email is required";
    if (!EMAIL_REGEX.test(trimmed)) return "Enter a valid email address";
  } else {
    if (!trimmed) return "Mobile number is required";
    if (!MOBILE_REGEX.test(trimmed.replace(MOBILE_SEPARATORS_REGEX, "")))
      return "Enter a valid mobile number (10–15 digits)";
  }
}
