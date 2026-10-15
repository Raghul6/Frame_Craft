# FrameCraft

React + TypeScript + Vite storefront (`client/`) with a Node.js (Express) + PostgreSQL API (`server/`) and JWT auth. Each folder is a separate npm project.

## Project structure

```
client/src/                  # Frontend (React + Redux Toolkit, structure follows MobileSales/frontend)
  api/          api.ts (axios instance + interceptors), tokenManager.ts (JWT + unauthorized handler)
  app/          store.ts, hooks.ts (typed useAppDispatch / useAppSelector)
  components/
    common/     Alert, ErrorBoundary, FormField, Pagination, PasswordInput, PasswordStrengthMeter, Spinner, StatusBadge
    layout/     Navbar
    admin/      AdminPageHeader, DetailShell, ListPanel, ListToolbar, OrdersTable, SizeRowEditor
    home/       one component per home-page section (Hero, Products, Reviews, Footer, …)
  config/       env.ts (API host from .env)
  constants/    admin, api, auth, home, navigation, ui  ← every constant lives here
  features/     one folder per domain: slice.ts + thunks.ts + selectors.ts
    auth/  dashboard/  users/  orders/  frames/
    shared/     listState.ts (shared list reducers), latestRequest.ts (abort stale requests)
  hooks/        useAuth, useAdminList, useListFilters, useDebounce, useRouteId, useClearAuthErrors
  layouts/      MainLayout (store), AdminLayout (admin sidebar/tabs)
  pages/        one folder per page, holding that page's .tsx and .css
    Home/  Login/  Register/
    admin/Dashboard/  Orders/  OrderDetail/  Frames/  FrameForm/  Users/  UserDetail/
  routes/       paths.ts (PATHS), AppRoutes, generateRoutes, lazyPages, ProtectedRoute, RoleBasedRoute, GuestRoute
  styles/       forms.css (global), auth.css, admin.css
  types/        api, auth, admin, state, forms, components, hooks, home, routes, store  ← every type lives here
  utils/        apiError, errors, format, frameForm, passwordStrength, text, validators

server/                      # Backend (Express 5 + pg + JWT, TypeScript)
  src/
    config/       env.ts (validated config, Node's built-in .env loader), db.ts (tuned pool, timeouts, slow-query log)
    constants/    admin, app, auth, pagination  ← every constant lives here
    controllers/  auth.controller.ts, admin.controller.ts
    db/           migrations/NNN_*.sql, migrate.ts (runs pending migrations once, in order), createAdmin.ts
    lib/          logger.ts (JSON logs in production, readable in dev)
    middleware/   auth (verifyToken), rateLimit, requestContext (request id + access log), error — middleware only
    models/       user, frame, order, dashboard, refreshToken
    routes/       index.ts (public vs JWT-protected), auth, admin, health
    services/     session.service.ts (access token + rotating refresh-token sessions)
    types/        admin, app, auth, db (row shapes), express.d.ts  ← every type lives here
    utils/        jwt (generateToken, verifyJwt), sql (SqlParams, LIKE escaping, one-query pagination), cookies, validators, assertRoutesProtected, …
```

Client code conventions:
- Redux: `features/<domain>/slice.ts` (start/success/fail reducers), `thunks.ts` (hand-rolled `(payload) => async (dispatch) => {}` thunks with try/catch and `extractError`), `selectors.ts`. List fetches abort the previous request (`features/shared/latestRequest.ts`).
- Components: arrow functions with `export default` at the bottom; props types in `types/components.ts`.
- No inline `style={{…}}` (use CSS classes); constants only in `constants/` (routes in `routes/paths.ts`); type/interface declarations only in `types/`; nothing directly inside `pages/`.
- Performance / lazy loading:
  - Every route except Home is code-split (`routes/lazyPages.ts`); Login/Register/Admin chunks are preloaded on hover/focus, and the admin shell on idle once an admin is signed in.
  - Home renders the hero immediately; everything below it is one lazy chunk (`components/home/BelowTheFold.tsx`) with `content-visibility: auto`.
  - Images: lazy below the fold, responsive `srcset` for large photos, explicit width/height. The logo is `public/logo-170.webp` / `logo-340.webp` (13–37 kB).
  - Libraries are split into stable `vendor-*` chunks (`vite.config.ts`) so app-only deploys keep them cached.
- Animations: shared tokens + keyframes in `styles/animations.css`; per-page motion at the bottom of each page's CSS. Scroll reveal = add `data-reveal="1…4"` (inside the home page's below-the-fold area, `useRevealOnScroll`). Only transform/opacity are animated, the hero headline never fades (it is the LCP element), page transitions skip the first load, and `prefers-reduced-motion` turns all motion off.
- Formatting: `npm run format` (Prettier: double quotes, semicolons, trailing commas). Lint: `npm run lint`.

## Getting started

1. **Database** — create a PostgreSQL database, e.g. `createdb framecraft`.
2. **Env files**
   ```bash
   cp server/.env.example server/.env   # set the DB_* values and JWT_SECRET (openssl rand -hex 64)
   cp client/.env.example client/.env   # VITE_API_HOST=http://localhost:5000
   ```
3. **Install, migrate, start** (from the project root)
   ```bash
   npm install          # also installs server/ and client/
   npm run db:migrate   # creates the users table
   npm start            # API on http://localhost:5000 + UI on http://localhost:5173
   ```

`npm start` also works inside each folder on its own: `cd server && npm start` (runs the TypeScript directly with `tsx`, restarts on save) or `cd client && npm start` (Vite).

Production server: `cd server && npm run build && npm run start:prod` (compiles to `server/dist/` and runs it with plain Node). `npm run typecheck` checks types without building.

## Admin panel

There is no separate admin login. Admins sign in on the normal `/login` page and are sent to `/admin` because of their role; customers are sent to the store and can't open `/admin`. Customers can only self-register as `customer`.

Create (or reset the password of) an admin account:

```bash
npm run create-admin -- --username admin --password 'Str0ng!Pass' [--email admin@example.com]
```

| Page | What it does |
| ---- | ------------ |
| `/admin` | Revenue, order, customer and frame counts + recent orders |
| `/admin/orders`, `/admin/orders/:id` | Search/filter orders, see items and shipping, change status |
| `/admin/frames`, `/admin/frames/new`, `/admin/frames/:id` | Add/edit/hide/delete frames; each frame has many sizes, each with its own price and stock |
| `/admin/users`, `/admin/users/:id` | Search users, see contact details, order count, total spent and order history |

Admin API (all require an admin JWT): `GET /api/admin/dashboard`, `GET /api/admin/users[/:id]`, `GET /api/admin/orders[/:id]`, `PATCH /api/admin/orders/:id/status`, `GET|POST /api/admin/frames`, `GET|PUT|DELETE /api/admin/frames/:id`.

## Backend security & performance

- **Every protected route is written `router.METHOD(path, verifyToken, handler)`** (routes/*.routes.ts). `verifyToken` checks the Bearer JWT — **HS256**, created by `generateToken` (utils/jwt.ts) and verified with the same `JWT_SECRET` from `.env` — plus issuer, audience and expiry, then loads the user and checks their **role from the database** against `ROUTE_ROLE_ACCESS` (constants/auth.ts: `/api/admin` → admin, `/api/auth` → any signed-in user; unlisted areas are denied). Only the routes in `PUBLIC_ROUTES` may skip it, and the server **refuses to start** if any other route lacks `verifyToken`.
- **Sessions:** a 15-minute access token (kept only in browser memory) + a 7-day refresh token in an `httpOnly; SameSite=Strict` cookie scoped to `/api/auth`. Refresh tokens rotate on every use and are stored only as SHA-256 hashes; replaying an old one revokes the whole session. Logout revokes it server-side. Expired tokens are purged hourly.
- **Rate limits:** 600 requests / 15 min per IP on the whole API, 20 on login/register, 10 failed logins per IP + username.
- **Database:** numbered migrations (`npm run db:migrate`), trigram (`pg_trgm`) indexes for admin search, `(created_at, id)` indexes for every list, LIKE wildcards escaped, rows + total in one query, bulk size writes, a 10 s statement timeout and pool limits.
- **Production:** `NODE_ENV=production` → JSON logs with a request id (also returned as `X-Request-Id`), Secure cookies, a 32+ character `JWT_SECRET` required. Set `TRUST_PROXY` to the number of proxies in front of the API and `DB_SSL=true` for managed databases. `GET /api/health/ready` checks the database for load balancers.

## Environment variables

| File | Variable | Example | Purpose |
| ---- | -------- | ------- | ------- |
| `client/.env` | `VITE_API_HOST` | `http://localhost:5000` | Backend host; the app calls `${VITE_API_HOST}/api/...` |
| `server/.env` | `PORT` | `5000` | API port |
| `server/.env` | `CLIENT_ORIGIN` | `http://localhost:5173` | Frontend URL(s) allowed by CORS, comma-separated |
| `server/.env` | `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | `localhost` / `5432` / … | PostgreSQL connection (or set `DATABASE_URL` instead) |
| `server/.env` | `JWT_SECRET` | `openssl rand -hex 64` | Signs and verifies JWTs (32+ chars required in production) |
| `server/.env` | `ACCESS_TOKEN_TTL` / `REFRESH_TOKEN_TTL_DAYS` | `15m` / `7` | Token lifetimes |
| `server/.env` | `NODE_ENV` / `TRUST_PROXY` / `LOG_LEVEL` / `COOKIE_SECURE` | `production` / `1` / `info` / `true` | Production behaviour (see `.env.example`) |
| `server/.env` | `DB_POOL_MAX` / `DB_SSL` | `10` / `false` | Connection pool size, TLS to the database |

If you change the client host or port, update `CLIENT_ORIGIN` on the server to match. Restart the dev servers after editing a `.env` file.

## Auth API

| Method | Path                 | Body                                                    | Notes                         |
| ------ | -------------------- | ------------------------------------------------------- | ----------------------------- |
| POST   | `/api/auth/register` | `{ username, contactType: "email"\|"mobile", contact, password }` | Always creates a `customer`   |
| POST   | `/api/auth/login`    | `{ username, password }`                                | Returns `{ token, user }`     |
| GET    | `/api/auth/me`       | —                                                       | `Authorization: Bearer <jwt>` |
| POST   | `/api/auth/refresh`  | — (refresh cookie)                                      | Returns `{ token, user }`, rotates the cookie |
| POST   | `/api/auth/logout`   | — (refresh cookie)                                      | Revokes the session, clears the cookie |

Password rules (enforced on client and server): 8–72 characters with an uppercase letter, a lowercase letter, a number and a special character.

The home page is public. Users log in only via the **Login** button in the navbar; wrap account-only pages in `<ProtectedRoute />` (see `client/src/routes/AppRoutes.tsx`).

The UI is responsive: desktop (> 1200px), laptop (≤ 1200px), tablet landscape (≤ 1024px), tablet portrait (≤ 900px, hamburger menu), mobile (≤ 600px) and small phones (≤ 380px). Breakpoints live in `client/src/App.css` and `client/src/pages/AuthPage.css`.
