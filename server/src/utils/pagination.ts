import type { Request } from "express";
import {
  DEFAULT_PAGE_SIZE,
  MAX_DB_INT,
  MAX_PAGE,
  MAX_PAGE_SIZE,
} from "../constants/pagination.js";
import type { PageParams } from "../types/admin.js";

const toPositiveInt = (value: unknown, fallback: number) => {
  const n = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export function getPageParams(
  query: Request["query"],
  defaultLimit = DEFAULT_PAGE_SIZE,
): PageParams {
  const page = Math.min(toPositiveInt(query.page, 1), MAX_PAGE);
  const limit = Math.min(
    toPositiveInt(query.limit, defaultLimit),
    MAX_PAGE_SIZE,
  );
  return { page, limit, offset: (page - 1) * limit };
}

export const queryString = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

/** Parses a positive integer route param; returns null when invalid or larger than an INT id can be. */
export function parseId(value: unknown): number | null {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 && n <= MAX_DB_INT ? n : null;
}
