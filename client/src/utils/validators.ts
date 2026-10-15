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
import { VALIDATION_MESSAGES } from "../constants/messages";

export const isStrongPassword = (password: string) =>
  password.length <= PASSWORD_MAX_LENGTH &&
  PASSWORD_RULES.every((rule) => rule.test(password));

export function validateUsername(value: string): string | undefined {
  if (!value.trim()) return VALIDATION_MESSAGES.usernameRequired;
  if (!USERNAME_REGEX.test(value.trim()))
    return VALIDATION_MESSAGES.usernameFormat;
}

export function validateContact(
  type: ContactType,
  value: string,
): string | undefined {
  const trimmed = value.trim();
  if (type === "email") {
    if (!trimmed) return VALIDATION_MESSAGES.emailRequired;
    if (!EMAIL_REGEX.test(trimmed)) return VALIDATION_MESSAGES.emailInvalid;
  } else {
    if (!trimmed) return VALIDATION_MESSAGES.mobileRequired;
    if (!MOBILE_REGEX.test(trimmed.replace(MOBILE_SEPARATORS_REGEX, "")))
      return VALIDATION_MESSAGES.mobileInvalid;
  }
}
