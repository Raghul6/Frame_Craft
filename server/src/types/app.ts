export type LogLevel = "debug" | "info" | "warn" | "error";

/** Extra structured fields attached to a log line. */
export type LogFields = Record<string, unknown>;

/** The parts of an Express router layer read by assertRoutesProtected. */
export interface RouterLayer {
  route?: {
    path: string;
    methods: Record<string, boolean>;
    stack: { handle: unknown }[];
  };
}
