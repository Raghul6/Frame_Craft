import { DASHBOARD_STAT_CARDS } from "../../constants/admin";
import Skeleton from "../common/Skeleton";
import TableSkeleton from "./TableSkeleton";
import {
  ADMIN_TABLE_COLUMNS,
  DASHBOARD_SKELETON_ROWS,
} from "../../constants/ui";

/** Placeholder stat cards + recent-orders table while the dashboard loads. */
const DashboardSkeleton = () => (
  <div role="status" aria-label="Loading">
    <div className="stat-grid">
      {DASHBOARD_STAT_CARDS.map(({ key }) => (
        <div key={key} className="stat-card skeleton-stack">
          <Skeleton shape="thumb" />
          <Skeleton shape="line-short" />
          <Skeleton shape="title" />
        </div>
      ))}
    </div>
    <section className="admin-panel">
      <TableSkeleton
        columns={ADMIN_TABLE_COLUMNS}
        rows={DASHBOARD_SKELETON_ROWS}
      />
    </section>
  </div>
);

export default DashboardSkeleton;
