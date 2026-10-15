import type { ListPanelProps } from "../../types/components";
import Alert from "../common/Alert";
import Pagination from "../common/Pagination";
import TableSkeleton from "./TableSkeleton";
import { ADMIN_TABLE_COLUMNS } from "../../constants/ui";

/**
 * The panel around every admin list: error alert, shimmering placeholder rows on the
 * first load, a progress bar + dimmed rows while a newer page/search loads, the empty
 * message, and pagination.
 */
const ListPanel = <T,>({
  list,
  skeletonColumns = ADMIN_TABLE_COLUMNS,
  emptyText,
  onPageChange,
  children,
}: ListPanelProps<T>) => {
  const loading = list.status === "loading";
  const firstLoad = loading && list.items.length === 0;

  return (
    <>
      {list.error && <Alert>{list.error}</Alert>}
      <section className="admin-panel admin-panel-list" aria-busy={loading}>
        {loading && !firstLoad && <div className="loading-bar" aria-hidden />}
        {firstLoad ? (
          <TableSkeleton columns={skeletonColumns} />
        ) : list.items.length === 0 ? (
          <div className="admin-empty">{emptyText}</div>
        ) : (
          <div className={loading ? "is-loading" : undefined}>{children}</div>
        )}
        <Pagination
          page={list.page}
          limit={list.limit}
          total={list.total}
          onChange={onPageChange}
        />
      </section>
    </>
  );
};

export default ListPanel;
