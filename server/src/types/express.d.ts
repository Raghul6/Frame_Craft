import type { AuthContext } from "./auth.js";

declare global {
  namespace Express {
    interface Request {
      /** Set by `requestContext`: echoed as X-Request-Id and included in every log line. */
      id: string;
      /** Set by `verifyToken` once the JWT, the user and the user's role have been verified. */
      auth?: AuthContext;
    }
  }
}

export {};
