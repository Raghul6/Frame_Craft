import type { ListPanelProps } from "../../types/components";
import Alert from "../common/Alert";
import Pagination from "../common/Pagination";
import Spinner from "../common/Spinner";

/**
 * The panel around every admin list: error alert, first-load spinner, empty
 * message, the table (dimmed while a newer page loads) and pagination.
 */
const ListPanel = <T,>({
  list,
  emptyText,
  onPageChange,
  children,
}: ListPanelProps<T>) => {
  const firstLoad = list.status === "loading" && list.items.length === 0;

  return (
    <>
      {list.error && <Alert>{list.error}</Alert>}
      <section className="admin-panel">
        {firstLoad ? (
          <Spinner full />
        ) : list.items.length === 0 ? (
          <div className="admin-empty">{emptyText}</div>
        ) : (
          <div className={list.status === "loading" ? "is-loading" : undefined}>
            {children}
          </div>
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
