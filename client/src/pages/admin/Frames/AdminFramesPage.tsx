import { ImageOff, Pencil, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import ListPanel from "../../../components/admin/ListPanel";
import ListToolbar from "../../../components/admin/ListToolbar";
import Alert from "../../../components/common/Alert";
import StatusBadge from "../../../components/common/StatusBadge";
import { FRAME_STATUS_OPTIONS } from "../../../constants/admin";
import {
  selectFrameRemove,
  selectFramesList,
} from "../../../features/frames/selectors";
import { deleteFrame, fetchFrames } from "../../../features/frames/thunks";
import { useAdminList } from "../../../hooks/useAdminList";
import type { Frame } from "../../../types/admin";
import { formatPriceRange } from "../../../utils/format";
import "./AdminFramesPage.css";

const frameMeta = (frame: Frame) =>
  [frame.material, frame.color].filter(Boolean).join(" · ") || "—";

const totalStock = (frame: Frame) =>
  frame.sizes.reduce((sum, size) => sum + size.stock, 0);

const AdminFramesPage = () => {
  const dispatch = useAppDispatch();
  const remove = useAppSelector(selectFrameRemove);
  const { list, reload, ...filters } = useAdminList({
    selectList: selectFramesList,
    fetchList: fetchFrames,
    filterKey: "status",
  });

  const handleDelete = async (frame: Frame) => {
    const confirmed = window.confirm(
      `Delete "${frame.name}" and all its sizes? Past orders keep their copy of the details.`,
    );
    if (!confirmed) return;
    // Refetch so the page refills (or moves back a page if it is now empty).
    if (await dispatch(deleteFrame(frame.id))) void reload();
  };

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Frames"
        description="Frames for sale. Each frame can have several sizes, each with its own price and stock."
      />

      <ListToolbar
        searchValue={filters.searchInput}
        searchPlaceholder="Search name, material or colour"
        onSearchChange={filters.setSearchInput}
        onSearchSubmit={filters.submitSearch}
        filter={{
          label: "Status",
          value: filters.filter,
          onChange: filters.setFilter,
          options: FRAME_STATUS_OPTIONS,
        }}
        actions={
          <Link to="/admin/frames/new" className="btn btn-primary admin-btn">
            <Plus size={16} /> Add frame
          </Link>
        }
      />

      {remove.error && <Alert>{remove.error}</Alert>}

      <ListPanel
        list={list}
        onPageChange={filters.setPage}
        emptyText={
          <>
            {filters.search || filters.filter
              ? "No frames match these filters."
              : "No frames yet."}{" "}
            <Link to="/admin/frames/new">Add the first one</Link>
          </>
        }
      >
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Frame</th>
                <th>Sizes</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th className="num">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.items.map((frame) => (
                <tr key={frame.id}>
                  <td data-label="Frame">
                    <div className="frame-cell">
                      {frame.imageUrl ? (
                        <img
                          src={frame.imageUrl}
                          alt=""
                          width={44}
                          height={44}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="frame-thumb-empty">
                          <ImageOff size={16} />
                        </span>
                      )}
                      <div>
                        <Link
                          to={`/admin/frames/${frame.id}`}
                          className="cell-strong"
                        >
                          {frame.name}
                        </Link>
                        <small>{frameMeta(frame)}</small>
                      </div>
                    </div>
                  </td>
                  <td data-label="Sizes">
                    <div className="size-chips">
                      {frame.sizes.map((size) => (
                        <span key={size.id} className="size-chip">
                          {size.label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td data-label="Price">
                    {formatPriceRange(frame.sizes.map((size) => size.price))}
                  </td>
                  <td data-label="Stock">{totalStock(frame)}</td>
                  <td data-label="Status">
                    <StatusBadge
                      value={frame.isActive ? "active" : "inactive"}
                    />
                  </td>
                  <td data-label="Actions" className="num">
                    <div className="row-actions">
                      <Link
                        to={`/admin/frames/${frame.id}`}
                        className="icon-action"
                        aria-label={`Edit ${frame.name}`}
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        type="button"
                        className="icon-action danger"
                        onClick={() => handleDelete(frame)}
                        disabled={remove.id === frame.id}
                        aria-label={`Delete ${frame.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ListPanel>
    </div>
  );
};

export default AdminFramesPage;
