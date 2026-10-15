import { SKELETON_ROWS } from "../../constants/ui";
import type { TableSkeletonProps } from "../../types/components";
import Skeleton from "../common/Skeleton";

/** Placeholder table with shimmering cells, shown while a list loads for the first time. */
const TableSkeleton = ({
  columns,
  rows = SKELETON_ROWS,
}: TableSkeletonProps) => (
  <div className="admin-table-wrap" role="status" aria-label="Loading">
    <table className="admin-table skeleton-table">
      <tbody>
        {Array.from({ length: rows }, (_, row) => (
          <tr key={row}>
            {Array.from({ length: columns }, (_, col) => (
              <td key={col}>
                <Skeleton shape={col === 0 ? "line" : "line-short"} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TableSkeleton;
