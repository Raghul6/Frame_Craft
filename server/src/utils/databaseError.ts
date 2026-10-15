/**
 * Thrown by the models when a query fails. `operation` names the model function so logs show
 * which query broke; the original pg error is kept as `cause`, and its SQLSTATE `code`
 * is copied so checks like `isUniqueViolation` still work.
 */
export class DatabaseError extends Error {
  readonly operation: string;
  readonly code?: string;

  constructor(operation: string, cause: unknown) {
    super(`Database error in ${operation}`, { cause });
    this.name = "DatabaseError";
    this.operation = operation;
    if (
      typeof cause === "object" &&
      cause !== null &&
      "code" in cause &&
      typeof cause.code === "string"
    ) {
      this.code = cause.code;
    }
  }
}

/** Runs a model query and rethrows any failure as a DatabaseError naming `operation`. */
export async function withDbErrors<T>(
  operation: string,
  work: () => Promise<T>,
): Promise<T> {
  try {
    return await work();
  } catch (err) {
    throw new DatabaseError(operation, err);
  }
}
