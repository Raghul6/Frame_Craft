import { query } from "../config/db.js";
import type { DashboardStatsRow } from "../types/db.js";
import { withDbErrors } from "../utils/databaseError.js";

/** Every dashboard number in one round trip (was four separate queries). */
export const getDashboardStats = () =>
  withDbErrors("getDashboardStats", async () => {
    const { rows } = await query<DashboardStatsRow>(
      `SELECT
         (SELECT COUNT(*) FROM users WHERE role = 'customer') AS customers,
         (SELECT COUNT(*) FROM frames) AS frames,
         COUNT(*) AS orders,
         COUNT(*) FILTER (WHERE status = 'pending') AS pending,
         COALESCE(SUM(total) FILTER (WHERE status <> 'cancelled'), 0) AS revenue
       FROM orders`,
    );
    return rows[0];
  });
