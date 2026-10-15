import { MAX_SEARCH_LENGTH } from "../constants/app.js";
import { query } from "../config/db.js";
import type { PageParams, Paginated } from "../types/admin.js";
import type { CountedRow } from "../types/db.js";

/** Collects query parameters and hands out their `$n` placeholders in order. */
export class SqlParams {
  readonly values: unknown[] = [];

  /** Adds a value and returns its placeholder, e.g. "$3". */
  add(value: unknown): string {
    this.values.push(value);
    return `$${this.values.length}`;
  }
}

/** "WHERE a AND b", or "" when there are no conditions. */
export const whereClause = (conditions: string[]): string =>
  conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

/**
 * A search term as a LIKE pattern matching it anywhere. `%`, `_` and `\` are escaped,
 * so searching for "_" finds underscores instead of matching every row.
 */
export const containsPattern = (term: string): string =>
  `%${term.slice(0, MAX_SEARCH_LENGTH).replace(/[\\%_]/g, "\\$&")}%`;

/**
 * Runs a list query whose SELECT includes `COUNT(*) OVER () AS total_count`, so the
 * page and the total come back in one round trip. Only when the page is past the
 * end (no rows to read the total from) does it fall back to `countSql`.
 */
export async function paginate<Row extends CountedRow, Item>(
  listSql: string,
  countSql: string,
  params: SqlParams,
  page: PageParams,
  toItem: (row: Row) => Item,
): Promise<Paginated<Item>> {
  const limit = params.add(page.limit);
  const offset = params.add(page.offset);
  const { rows } = await query<Row>(
    `${listSql} LIMIT ${limit} OFFSET ${offset}`,
    params.values,
  );

  let total = rows[0]?.total_count ?? 0;
  if (rows.length === 0 && page.offset > 0) {
    const countValues = params.values.slice(0, -2);
    total = (await query<{ total: number }>(countSql, countValues)).rows[0]
      .total;
  }
  return { items: rows.map(toItem), page: page.page, limit: page.limit, total };
}
