import { Link, useNavigate } from "react-router-dom";
import type { OrdersTableProps } from "../../types/components";
import { formatDateTime, formatMoney } from "../../utils/format";
import StatusBadge from "../common/StatusBadge";

const OrdersTable = ({ orders, emptyText, hideCustomer }: OrdersTableProps) => {
  const navigate = useNavigate();

  if (orders.length === 0)
    return <div className="admin-empty">{emptyText}</div>;

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order</th>
            {!hideCustomer && <th>Customer</th>}
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Placed</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            // The whole row is clickable; the order number is a real link for
            // keyboard users and ctrl/middle-click.
            <tr
              key={o.id}
              className="clickable"
              onClick={() => navigate(`/admin/orders/${o.id}`)}
            >
              <td data-label="Order" className="cell-strong">
                <Link
                  to={`/admin/orders/${o.id}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  #{o.id}
                </Link>
              </td>
              {!hideCustomer && (
                <td data-label="Customer">{o.customer.username}</td>
              )}
              <td data-label="Items">{o.itemCount}</td>
              <td data-label="Total">{formatMoney(o.total)}</td>
              <td data-label="Status">
                <StatusBadge value={o.status} />
              </td>
              <td data-label="Placed">{formatDateTime(o.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
