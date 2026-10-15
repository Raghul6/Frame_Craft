import { query } from "../config/db.js";
import type {
  OrderDetail,
  OrderFilters,
  OrderStatus,
  OrderSummary,
  PageParams,
  Paginated,
} from "../types/admin.js";
import type {
  CountedRow,
  OrderDetailRow,
  OrderItemRow,
  OrderSummaryRow,
} from "../types/db.js";
import { withDbErrors } from "../utils/databaseError.js";
import { parseId } from "../utils/pagination.js";
import {
  containsPattern,
  paginate,
  SqlParams,
  whereClause,
} from "../utils/sql.js";

const toSummary = (row: OrderSummaryRow): OrderSummary => ({
  id: row.id,
  status: row.status,
  total: row.total,
  itemCount: row.item_count,
  createdAt: row.created_at,
  customer: { id: row.user_id, username: row.username },
});

// Item count per order, computed only for the rows actually returned.
const ITEM_COUNT_JOIN = `
  LEFT JOIN LATERAL (
    SELECT COALESCE(SUM(i.quantity), 0) AS item_count FROM order_items i WHERE i.order_id = o.id
  ) ic ON TRUE`;

const SUMMARY_COLUMNS =
  "o.id, o.status, o.total, o.created_at, u.id AS user_id, u.username, ic.item_count";

export const listOrders = (
  filters: OrderFilters,
  page: PageParams,
): Promise<Paginated<OrderSummary>> =>
  withDbErrors("listOrders", () => {
    const params = new SqlParams();
    const conditions: string[] = [];
    if (filters.status)
      conditions.push(`o.status = ${params.add(filters.status)}`);
    if (filters.userId)
      conditions.push(`o.user_id = ${params.add(filters.userId)}`);
    if (filters.search) {
      // "42" or "#42" also matches order number 42.
      const byName = `u.username ILIKE ${params.add(containsPattern(filters.search))}`;
      const orderId = parseId(filters.search.replace(/^#/, ""));
      conditions.push(
        orderId ? `(${byName} OR o.id = ${params.add(orderId)})` : byName,
      );
    }
    const where = whereClause(conditions);

    return paginate<OrderSummaryRow & CountedRow, OrderSummary>(
      `SELECT ${SUMMARY_COLUMNS}, COUNT(*) OVER () AS total_count
       FROM orders o JOIN users u ON u.id = o.user_id ${ITEM_COUNT_JOIN}
       ${where}
       ORDER BY o.created_at DESC, o.id DESC`,
      `SELECT COUNT(*) AS total FROM orders o JOIN users u ON u.id = o.user_id ${where}`,
      params,
      page,
      toSummary,
    );
  });

export const recentOrders = (limit: number) =>
  withDbErrors("recentOrders", async () => {
    const { rows } = await query<OrderSummaryRow>(
      `SELECT ${SUMMARY_COLUMNS}
       FROM orders o JOIN users u ON u.id = o.user_id ${ITEM_COUNT_JOIN}
       ORDER BY o.created_at DESC, o.id DESC
       LIMIT $1`,
      [limit],
    );
    return rows.map(toSummary);
  });

export const findOrderById = (id: number): Promise<OrderDetail | null> =>
  withDbErrors("findOrderById", async () => {
    const [orderRes, itemsRes] = await Promise.all([
      query<OrderDetailRow>(
        `SELECT ${SUMMARY_COLUMNS}, o.updated_at, o.shipping_name, o.shipping_phone,
                o.shipping_address, u.email, u.mobile
         FROM orders o JOIN users u ON u.id = o.user_id ${ITEM_COUNT_JOIN}
         WHERE o.id = $1`,
        [id],
      ),
      query<OrderItemRow>(
        `SELECT id, frame_id, frame_size_id, frame_name, size_label, unit_price, quantity
         FROM order_items WHERE order_id = $1 ORDER BY id`,
        [id],
      ),
    ]);
    const row = orderRes.rows[0];
    if (!row) return null;

    return {
      ...toSummary(row),
      updatedAt: row.updated_at,
      shippingName: row.shipping_name,
      shippingPhone: row.shipping_phone,
      shippingAddress: row.shipping_address,
      customer: {
        id: row.user_id,
        username: row.username,
        email: row.email,
        mobile: row.mobile,
      },
      items: itemsRes.rows.map((item) => ({
        id: item.id,
        frameId: item.frame_id,
        frameSizeId: item.frame_size_id,
        frameName: item.frame_name,
        sizeLabel: item.size_label,
        unitPrice: item.unit_price,
        quantity: item.quantity,
      })),
    };
  });

export const updateOrderStatus = (id: number, status: OrderStatus) =>
  withDbErrors("updateOrderStatus", async () => {
    // Skips the write (and the updated_at bump) when the status is unchanged.
    const { rowCount } = await query(
      `UPDATE orders SET status = $2, updated_at = NOW()
       WHERE id = $1 AND status IS DISTINCT FROM $2`,
      [id, status],
    );
    if (rowCount) return true;
    const exists = await query("SELECT 1 FROM orders WHERE id = $1", [id]);
    return (exists.rowCount ?? 0) > 0;
  });
