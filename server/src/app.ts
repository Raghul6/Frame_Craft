import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { JSON_BODY_LIMIT } from "./constants/app.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import { apiLimiter } from "./middleware/rateLimit.middleware.js";
import { requestContext } from "./middleware/requestContext.middleware.js";
import api from "./routes/index.js";

const app = express();

// Behind N reverse proxies, trust N hops of X-Forwarded-For so req.ip (rate limits,
// session records) is the real client and not the proxy.
app.set("trust proxy", env.trustProxy);

app.use(requestContext);
app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigins,
    // The refresh token travels in an httpOnly cookie, so credentials must be allowed.
    credentials: true,
    // Browsers may cache the preflight for 10 minutes instead of sending one per request.
    maxAge: 600,
  }),
);
app.use(compression());
app.use(express.json({ limit: JSON_BODY_LIMIT }));

// Admin and account data is private: never let a shared proxy or the browser cache it.
app.use("/api", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use("/api", apiLimiter, api);

app.use(notFound);
app.use(errorHandler);

export default app;
