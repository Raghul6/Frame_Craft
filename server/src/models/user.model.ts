import { query } from "../config/db.js";
import type {
  AdminUserSummary,
  PageParams,
  Paginated,
  UserFilters,
} from "../types/admin.js";
import type {
  CreateCustomerInput,
  PublicUser,
  RegisterInput,
} from "../types/auth.js";
import type {
  AdminUserRow,
  AuthUserRow,
  Conflicts,
  CountedRow,
  LoginUserRow,
  PublicUserRow,
  UpsertAdminRow,
} from "../types/db.js";
import { withDbErrors } from "../utils/databaseError.js";
import {
  containsPattern,
  paginate,
  SqlParams,
  whereClause,
} from "../utils/sql.js";

const PUBLIC_COLUMNS = "id, username, email, mobile, role, created_at";

export const toPublicUser = (row: PublicUserRow): PublicUser => ({
  id: row.id,
  username: row.username,
  email: row.email,
  mobile: row.mobile,
  role: row.role,
  createdAt: row.created_at,
});

/** For login: the public columns plus the password hash. Uses the LOWER(username) index. */
export const findByUsername = (username: string) =>
  withDbErrors("findByUsername", async () => {
    const { rows } = await query<LoginUserRow>(
      `SELECT ${PUBLIC_COLUMNS}, password_hash FROM users WHERE LOWER(username) = LOWER($1)`,
      [username],
    );
    return rows[0] ?? null;
  });

export const findById = (id: number) =>
  withDbErrors("findById", async () => {
    const { rows } = await query<PublicUserRow>(
      `SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = $1`,
      [id],
    );
    return rows[0] ?? null;
  });

/** Primary-key lookup run on every authenticated request — the role always comes from the DB. */
export const findAuthUser = (id: number) =>
  withDbErrors("findAuthUser", async () => {
    const { rows } = await query<AuthUserRow>(
      "SELECT id, role FROM users WHERE id = $1",
      [id],
    );
    return rows[0] ?? null;
  });

export const findConflicts = ({
  username,
  email,
  mobile,
}: Pick<RegisterInput, "username" | "email" | "mobile">) =>
  withDbErrors("findConflicts", async () => {
    const { rows } = await query<Conflicts>(
      `SELECT
         BOOL_OR(LOWER(username) = LOWER($1)) AS username,
         BOOL_OR($2::text IS NOT NULL AND LOWER(email) = LOWER($2)) AS email,
         BOOL_OR($3::text IS NOT NULL AND mobile = $3) AS mobile
       FROM users
       WHERE LOWER(username) = LOWER($1)
          OR ($2::text IS NOT NULL AND LOWER(email) = LOWER($2))
          OR ($3::text IS NOT NULL AND mobile = $3)`,
      [username, email, mobile],
    );
    return rows[0];
  });

// Self-registration always creates a customer; admins are provisioned separately.
export const createCustomer = ({
  username,
  email,
  mobile,
  passwordHash,
}: CreateCustomerInput) =>
  withDbErrors("createCustomer", async () => {
    const { rows } = await query<PublicUserRow>(
      `INSERT INTO users (username, email, mobile, password_hash, role)
       VALUES ($1, $2, $3, $4, 'customer')
       RETURNING ${PUBLIC_COLUMNS}`,
      [username, email, mobile, passwordHash],
    );
    return rows[0];
  });

// ---------- Admin queries ----------

const toAdminUser = (row: AdminUserRow): AdminUserSummary => ({
  ...toPublicUser(row),
  orderCount: row.order_count,
  totalSpent: row.total_spent,
});

// Order totals per user, joined LATERAL so they're computed only for the rows on the page.
const ORDER_TOTALS_JOIN = `
  LEFT JOIN LATERAL (
    SELECT COUNT(*) AS order_count,
           COALESCE(SUM(o.total) FILTER (WHERE o.status <> 'cancelled'), 0) AS total_spent
    FROM orders o WHERE o.user_id = u.id
  ) t ON TRUE`;

export const listUsers = (
  filters: UserFilters,
  page: PageParams,
): Promise<Paginated<AdminUserSummary>> =>
  withDbErrors("listUsers", () => {
    const params = new SqlParams();
    const conditions: string[] = [];
    if (filters.search) {
      const pattern = params.add(containsPattern(filters.search));
      conditions.push(
        `(u.username ILIKE ${pattern} OR u.email ILIKE ${pattern} OR u.mobile ILIKE ${pattern})`,
      );
    }
    if (filters.role) conditions.push(`u.role = ${params.add(filters.role)}`);
    const where = whereClause(conditions);

    // Page the users first (index on created_at), then total orders for just those rows.
    return paginate<AdminUserRow & CountedRow, AdminUserSummary>(
      `SELECT u.id, u.username, u.email, u.mobile, u.role, u.created_at,
              t.order_count, t.total_spent, COUNT(*) OVER () AS total_count
       FROM users u ${ORDER_TOTALS_JOIN}
       ${where}
       ORDER BY u.created_at DESC, u.id DESC`,
      `SELECT COUNT(*) AS total FROM users u ${where}`,
      params,
      page,
      toAdminUser,
    );
  });

export const findAdminUserById = (id: number) =>
  withDbErrors("findAdminUserById", async () => {
    const { rows } = await query<AdminUserRow>(
      `SELECT u.id, u.username, u.email, u.mobile, u.role, u.created_at, t.order_count, t.total_spent
       FROM users u ${ORDER_TOTALS_JOIN}
       WHERE u.id = $1`,
      [id],
    );
    return rows[0] ? toAdminUser(rows[0]) : null;
  });

/** Creates an admin, or promotes / resets the password of an existing account — one statement. */
export const upsertAdmin = (
  username: string,
  passwordHash: string,
  email: string | null,
) =>
  withDbErrors("upsertAdmin", async () => {
    const { rows } = await query<UpsertAdminRow>(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin')
       ON CONFLICT ((LOWER(username))) DO UPDATE
         SET role = 'admin', password_hash = EXCLUDED.password_hash,
             email = COALESCE(EXCLUDED.email, users.email), updated_at = NOW()
       RETURNING ${PUBLIC_COLUMNS}, (xmax = 0) AS created`,
      [username, email, passwordHash],
    );
    return { user: rows[0], created: rows[0].created };
  });
