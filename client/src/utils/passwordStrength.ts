import {
  PASSWORD_RULES,
  STRENGTH_LABELS,
  STRENGTH_LONG_PASSWORD,
  STRENGTH_SHORT_PASSWORD,
} from "../constants/auth";
import type { PasswordStrength, StrengthLevel } from "../types/auth";

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { level: 0, label: "" };

  const passed = PASSWORD_RULES.filter((rule) => rule.test(password)).length;
  let level: number;
  if (passed <= 2) level = 1;
  else if (passed === 3) level = 2;
  else if (passed === 4) level = 3;
  else level = 4;

  // Only a password meeting every rule can be "Strong"; long ones bump up a level otherwise.
  if (level < 4 && password.length >= STRENGTH_LONG_PASSWORD && passed >= 3)
    level += 1;
  if (level === 4 && passed < PASSWORD_RULES.length) level = 3;
  if (password.length < STRENGTH_SHORT_PASSWORD) level = Math.min(level, 1);

  return { level: level as StrengthLevel, label: STRENGTH_LABELS[level] };
}
