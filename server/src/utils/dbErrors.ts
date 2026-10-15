import { PG_UNIQUE_VIOLATION } from "../constants/app.js";

/** True when `err` is a PostgreSQL unique-constraint violation. */
export const isUniqueViolation = (err: unknown) =>
  typeof err === "object" &&
  err !== null &&
  "code" in err &&
  err.code === PG_UNIQUE_VIOLATION;
