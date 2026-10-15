// Shapes shared by every API call and every slice.

/** Lifecycle of a single async request tracked in a slice. */
export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

/** A page of results, as returned by every admin list endpoint. */
export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

/** Query string accepted by the admin list endpoints. Empty values are dropped. */
export interface ListQuery {
  page?: number;
  search?: string;
  status?: string;
  role?: string;
}

/** Field name → message, as sent by the backend's 400/409 responses. */
export type FieldErrors = Partial<Record<string, string>>;

/** The backend's error body: `{ message, errors? }`. */
export interface ApiErrorBody {
  message?: string;
  errors?: FieldErrors;
}

/** Payload of every `...Fail` action. */
export interface RequestError {
  message: string;
  fieldErrors: FieldErrors;
}

/** State for one paginated list in a slice. */
export interface ListState<T> extends Paginated<T> {
  status: RequestStatus;
  error: string | null;
}

export interface LatestRequest {
  /** Aborts the previous request (if still running) and returns a fresh signal. */
  start: () => AbortController;
  /** Call in `finally` so the tracker forgets a request that has settled. */
  finish: (controller: AbortController) => void;
  /** Aborts the running request, if any. */
  abort: () => void;
}
