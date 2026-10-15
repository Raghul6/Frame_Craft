import { Plus } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import OrdersTable from "../../../components/admin/OrdersTable";
import Alert from "../../../components/common/Alert";
import Spinner from "../../../components/common/Spinner";
import {
  DASHBOARD_STAT_CARDS,
  RECENT_ORDERS_EMPTY_TEXT,
} from "../../../constants/admin";
import {
  selectDashboardError,
  selectDashboardStats,
  selectDashboardStatus,
} from "../../../features/dashboard/selectors";
import { fetchDashboard } from "../../../features/dashboard/thunks";
import { PATHS } from "../../../routes/paths";
import { formatMoney } from "../../../utils/format";
import "./AdminDashboardPage.css";

const AdminDashboardPage = () => {
  const dispatch = useAppDispatch();
  const stats = useAppSelector(selectDashboardStats);
  const status = useAppSelector(selectDashboardStatus);
  const error = useAppSelector(selectDashboardError);

  useEffect(() => {
    void dispatch(fetchDashboard());
  }, [dispatch]);

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Dashboard"
        description="An overview of the store."
        actions={
          <Link to={PATHS.admin.newFrame} className="btn btn-primary admin-btn">
            <Plus size={16} /> Add frame
          </Link>
        }
      />

      {status === "failed" && error && <Alert>{error}</Alert>}
      {!stats && status !== "failed" && <Spinner full />}

      {stats && (
        <>
          <div className="stat-grid">
            {DASHBOARD_STAT_CARDS.map(
              ({ key, label, icon: Icon, to, money }) => (
                <Link key={key} to={to} className="stat-card">
                  <span className="stat-icon">
                    <Icon size={18} />
                  </span>
                  <span className="stat-label">{label}</span>
                  <span className="stat-value">
                    {money ? formatMoney(stats[key]) : stats[key]}
                  </span>
                </Link>
              ),
            )}
          </div>

          <section className="admin-panel">
            <div className="admin-panel-header">
              <h2>Recent orders</h2>
              <Link to={PATHS.admin.orders}>View all</Link>
            </div>
            <OrdersTable
              orders={stats.recentOrders}
              emptyText={RECENT_ORDERS_EMPTY_TEXT}
            />
          </section>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
