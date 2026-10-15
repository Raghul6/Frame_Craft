import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationProps } from "../../types/components";

const Pagination = ({ page, limit, total, onChange }: PaginationProps) => {
  if (total === 0) return null;

  const pages = Math.max(1, Math.ceil(total / limit));
  // Clamp so an out-of-range ?page= never shows "1961–5 of 5".
  const current = Math.min(page, pages);
  const from = (current - 1) * limit + 1;
  const to = Math.min(current * limit, total);

  return (
    <div className="admin-pagination">
      <span>
        {from}–{to} of {total}
      </span>
      <div>
        <button
          type="button"
          onClick={() => onChange(current - 1)}
          disabled={current <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        <span>
          Page {current} / {pages}
        </span>
        <button
          type="button"
          onClick={() => onChange(current + 1)}
          disabled={current >= pages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
