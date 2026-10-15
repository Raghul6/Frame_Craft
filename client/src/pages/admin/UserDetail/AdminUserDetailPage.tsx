import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import DetailShell from "../../../components/admin/DetailShell";
import OrdersTable from "../../../components/admin/OrdersTable";
import Alert from "../../../components/common/Alert";
import Pagination from "../../../components/common/Pagination";
import StatusBadge from "../../../components/common/StatusBadge";
import { selectUserDetail } from "../../../features/users/selectors";
import { fetchUserDetail } from "../../../features/users/thunks";
import { useRouteId } from "../../../hooks/useRouteId";
import type { OrderPaging } from "../../../types/forms";
import { formatDateTime, formatMoney } from "../../../utils/format";

const AdminUserDetailPage = () => {
  const dispatch = useAppDispatch();
  const id = useRouteId();
  const { user, orders, status, error } = useAppSelector(selectUserDetail);
  // Order-history page, reset to 1 whenever a different user is opened.
  const [paging, setPaging] = useState<OrderPaging>({ id, page: 1 });
  const page = paging.id === id ? paging.page : 1;

  useEffect(() => {
    if (id) void dispatch(fetchUserDetail(id, page));
  }, [dispatch, id, page]);

  if (!id) {
    return (
      <div className="admin-page">
        <Alert>That user link is not valid.</Alert>
      </div>
    );
  }

  return (
    <DetailShell
      backTo="/admin/users"
      backLabel="All users"
      status={status}
      error={error}
      // Only show a record that belongs to this URL (never a slower earlier one).
      ready={user?.id === id}
    >
      {user && (
        <>
          <AdminPageHeader
            title={user.username}
            description={
              <>
                <StatusBadge value={user.role} /> · User #{user.id}
              </>
            }
          />

          <div className="detail-grid">
            <section className="admin-panel">
              <h2>Account</h2>
              <dl className="detail-list">
                <dt>Username</dt>
                <dd>{user.username}</dd>
                <dt>Email</dt>
                <dd>{user.email ?? "—"}</dd>
                <dt>Mobile</dt>
                <dd>{user.mobile ?? "—"}</dd>
                <dt>Joined</dt>
                <dd>{formatDateTime(user.createdAt)}</dd>
              </dl>
            </section>
            <section className="admin-panel">
              <h2>Purchases</h2>
              <dl className="detail-list">
                <dt>Orders</dt>
                <dd>{user.orderCount}</dd>
                <dt>Total spent</dt>
                <dd>{formatMoney(user.totalSpent)}</dd>
                <dt>Average order</dt>
                <dd>
                  {user.orderCount
                    ? formatMoney(user.totalSpent / user.orderCount)
                    : "—"}
                </dd>
              </dl>
            </section>
          </div>

          <section className="admin-panel">
            <div className="admin-panel-header">
              <h2>Orders</h2>
            </div>
            <OrdersTable
              orders={orders?.items ?? []}
              emptyText="This user hasn't placed any orders."
              hideCustomer
            />
            {orders && (
              <Pagination
                page={orders.page}
                limit={orders.limit}
                total={orders.total}
                onChange={(p) => setPaging({ id, page: p })}
              />
            )}
          </section>
        </>
      )}
    </DetailShell>
  );
};

export default AdminUserDetailPage;
