export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
/** Requests past this page are clamped so OFFSET stays a sane number. */
export const MAX_PAGE = 100_000;
/** Largest value of a PostgreSQL INT / SERIAL column; ids above this can't exist. */
export const MAX_DB_INT = 2_147_483_647;
