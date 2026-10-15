import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import DetailShell from "../../../components/admin/DetailShell";
import Alert from "../../../components/common/Alert";
import StatusBadge from "../../../components/common/StatusBadge";
import { ORDER_STATUS_OPTIONS } from "../../../constants/admin";
import {
  selectOrderDetail,
  selectOrderStatusUpdate,
} from "../../../features/orders/selectors";
import { changeOrderStatus, fetchOrder } from "../../../features/orders/thunks";
import { useRouteId } from "../../../hooks/useRouteId";
import type { OrderStatus } from "../../../types/admin";
import type { OrderStatusDraft } from "../../../types/forms";
import { formatDateTime, formatMoney } from "../../../utils/format";
import "./AdminOrderDetailPage.css";
import ButtonLabel from "../../../components/common/ButtonLabel";
import {
  BUTTON_LABELS,
  EMPTY_MESSAGES,
  INVALID_LINK_MESSAGES,
} from "../../../constants/messages";
import { EMPTY_VALUE } from "../../../constants/ui";

const AdminOrderDetailPage = () => {
  const dispatch = useAppDispatch();
  const id = useRouteId();
  const { order, status, error } = useAppSelector(selectOrderDetail);
  const statusUpdate = useAppSelector(selectOrderStatusUpdate);
  // Selected-but-unsaved status for this order; ignored once another order is opened.
  const [draft, setDraft] = useState<OrderStatusDraft | null>(null);

  useEffect(() => {
    if (id) void dispatch(fetchOrder(id));
  }, [dispatch, id]);

  const current = order?.id === id ? order : null;
  const selected = (draft?.id === id ? draft.status : null) ?? current?.status;
  const subtotal = useMemo(
    () =>
      current?.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0,
      ) ?? 0,
    [current],
  );
  const saving = statusUpdate.status === "loading";

  const save = async () => {
    if (!current || !selected || selected === current.status) return;
    if (await dispatch(changeOrderStatus(current.id, selected))) setDraft(null);
  };

  if (!id) {
    return (
      <div className="admin-page">
        <Alert>{INVALID_LINK_MESSAGES.order}</Alert>
      </div>
    );
  }

  return (
    <DetailShell
      backTo="/admin/orders"
      backLabel="All orders"
      status={status}
      error={error}
      ready={current !== null}
    >
      {current && (
        <>
          <AdminPageHeader
            title={`Order #${current.id}`}
            description={
              <>
                <StatusBadge value={current.status} /> · Placed{" "}
                {formatDateTime(current.createdAt)}
              </>
            }
            actions={
              <div className="status-control">
                <label htmlFor="order-status">Status</label>
                <select
                  id="order-status"
                  value={selected}
                  onChange={(e) =>
                    setDraft({ id, status: e.target.value as OrderStatus })
                  }
                  disabled={saving}
                >
                  {ORDER_STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-primary admin-btn"
                  onClick={save}
                  disabled={saving || selected === current.status}
                >
                  <ButtonLabel
                    loading={saving}
                    {...BUTTON_LABELS.updateStatus}
                  />
                </button>
              </div>
            }
          />

          <div className="detail-grid">
            <section className="admin-panel">
              <h2>Customer</h2>
              <dl className="detail-list">
                <dt>Username</dt>
                <dd>
                  <Link to={`/admin/users/${current.customer.id}`}>
                    {current.customer.username}
                  </Link>
                </dd>
                <dt>Email</dt>
                <dd>{current.customer.email ?? EMPTY_VALUE}</dd>
                <dt>Mobile</dt>
                <dd>{current.customer.mobile ?? EMPTY_VALUE}</dd>
              </dl>
            </section>
            <section className="admin-panel">
              <h2>Shipping</h2>
              <dl className="detail-list">
                <dt>Name</dt>
                <dd>{current.shippingName || EMPTY_VALUE}</dd>
                <dt>Phone</dt>
                <dd>{current.shippingPhone || EMPTY_VALUE}</dd>
                <dt>Address</dt>
                <dd className="pre-line">
                  {current.shippingAddress || EMPTY_VALUE}
                </dd>
              </dl>
            </section>
          </div>

          <section className="admin-panel">
            <h2>Items</h2>
            {current.items.length === 0 ? (
              <div className="admin-empty">{EMPTY_MESSAGES.orderItems}</div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Frame</th>
                      <th>Size</th>
                      <th>Unit price</th>
                      <th>Qty</th>
                      <th className="num">Line total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {current.items.map((item) => (
                      <tr key={item.id}>
                        <td data-label="Frame" className="cell-strong">
                          {item.frameId ? (
                            <Link to={`/admin/frames/${item.frameId}`}>
                              {item.frameName}
                            </Link>
                          ) : (
                            item.frameName
                          )}
                        </td>
                        <td data-label="Size">{item.sizeLabel}</td>
                        <td data-label="Unit price">
                          {formatMoney(item.unitPrice)}
                        </td>
                        <td data-label="Qty">{item.quantity}</td>
                        <td data-label="Line total" className="num">
                          {formatMoney(item.unitPrice * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <dl className="order-totals">
              <dt>Items subtotal</dt>
              <dd>{formatMoney(subtotal)}</dd>
              <dt>Order total</dt>
              <dd className="cell-strong">{formatMoney(current.total)}</dd>
            </dl>
          </section>
        </>
      )}
    </DetailShell>
  );
};

export default AdminOrderDetailPage;
