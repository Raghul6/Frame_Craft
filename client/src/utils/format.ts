import { CURRENCY, DATE_LOCALE, EMPTY_VALUE, LOCALE } from "../constants/ui";
import { reportError } from "./errors";

const currency = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
});
const dateTime = new Intl.DateTimeFormat(DATE_LOCALE, {
  dateStyle: "medium",
  timeStyle: "short",
});
const date = new Intl.DateTimeFormat(DATE_LOCALE, { dateStyle: "medium" });

// Intl throws a RangeError for an invalid Date; show a dash instead of crashing the page.
function safeFormat(
  format: () => string,
  context: string,
  value: unknown,
): string {
  try {
    return format();
  } catch (err) {
    reportError(`format.${context}(${String(value)})`, err);
    return EMPTY_VALUE;
  }
}

export const formatMoney = (value: number) =>
  Number.isFinite(value)
    ? safeFormat(() => currency.format(value), "money", value)
    : EMPTY_VALUE;

export const formatDateTime = (iso: string) =>
  safeFormat(() => dateTime.format(new Date(iso)), "dateTime", iso);

export const formatDate = (iso: string) =>
  safeFormat(() => date.format(new Date(iso)), "date", iso);

export function formatPriceRange(prices: number[]): string {
  const valid = prices.filter(Number.isFinite);
  if (valid.length === 0) return EMPTY_VALUE;
  const min = Math.min(...valid);
  const max = Math.max(...valid);
  return min === max
    ? formatMoney(min)
    : `${formatMoney(min)} – ${formatMoney(max)}`;
}
