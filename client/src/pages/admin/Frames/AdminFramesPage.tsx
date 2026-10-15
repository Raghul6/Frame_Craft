import { ImageOff, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import ListPanel from "../../../components/admin/ListPanel";
import ListToolbar from "../../../components/admin/ListToolbar";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import StatusBadge from "../../../components/common/StatusBadge";
import { FRAME_STATUS_OPTIONS } from "../../../constants/admin";
import {
  EMPTY_VALUE,
  FRAME_THUMB_SIZE,
  ICON_SIZE,
  ROW_REMOVE_ANIMATION_MS,
} from "../../../constants/ui";
import { CONFIRM_MESSAGES, EMPTY_MESSAGES } from "../../../constants/messages";
import {
  selectFrameRemove,
  selectFramesList,
} from "../../../features/frames/selectors";
import { frameRemovedFromList } from "../../../features/frames/slice";
import { deleteFrame, fetchFrames } from "../../../features/frames/thunks";
import { useAdminList } from "../../../hooks/useAdminList";
import type { Frame } from "../../../types/admin";
import { formatPriceRange } from "../../../utils/format";
import { wait } from "../../../utils/wait";
import "./AdminFramesPage.css";

const frameMeta = (frame: Frame) =>
  [frame.material, frame.color].filter(Boolean).join(" · ") || EMPTY_VALUE;

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

  // The frame waiting for confirmation in the dialog (null = dialog closed).
  const [pendingDelete, setPendingDelete] = useState<Frame | null>(null);
  // The row playing its slide-out animation after a delete.
  const [removingId, setRemovingId] = useState<number | null>(null);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const { id, name } = pendingDelete;
    // The thunk shows the "deleted" / error toast.
    const deleted = await dispatch(deleteFrame(id, name));
    setPendingDelete(null);
    if (!deleted) return;

    // Let the row slide out, then drop it and refetch so the page refills
    // (or moves back a page if it is now empty).
    setRemovingId(id);
    await wait(ROW_REMOVE_ANIMATION_MS);
    dispatch(frameRemovedFromList(id));
    setRemovingId(null);
    void reload();
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
            <Plus size={ICON_SIZE.md} /> Add frame
          </Link>
        }
      />

      <ListPanel
        list={list}
        onPageChange={filters.setPage}
        emptyText={
          <>
            {filters.search || filters.filter
              ? EMPTY_MESSAGES.framesFiltered
              : EMPTY_MESSAGES.framesNone}{" "}
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
                <tr
                  key={frame.id}
                  className={
                    removingId === frame.id ? "row-removing" : undefined
                  }
                >
                  <td data-label="Frame">
                    <div className="frame-cell">
                      {frame.imageUrl ? (
                        <img
                          src={frame.imageUrl}
                          alt=""
                          width={FRAME_THUMB_SIZE}
                          height={FRAME_THUMB_SIZE}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="frame-thumb-empty">
                          <ImageOff size={ICON_SIZE.md} />
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
                        <Pencil size={ICON_SIZE.action} />
                      </Link>
                      <button
                        type="button"
                        className="icon-action danger"
                        onClick={() => setPendingDelete(frame)}
                        disabled={remove.id === frame.id}
                        aria-label={`Delete ${frame.name}`}
                      >
                        <Trash2 size={ICON_SIZE.action} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ListPanel>

      <ConfirmDialog
        open={pendingDelete !== null}
        {...CONFIRM_MESSAGES.deleteFrame(pendingDelete?.name ?? "")}
        danger
        busy={remove.id !== null}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default AdminFramesPage;
