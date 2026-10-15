import { Search, X } from "lucide-react";
import type { FormEvent } from "react";
import type { ListToolbarProps } from "../../types/components";
import { ICON_SIZE, SEARCH_MAX_LENGTH } from "../../constants/ui";

/** Search box (debounced by the page's useListFilters) + one filter + optional actions. */
const ListToolbar = ({
  searchValue,
  searchPlaceholder,
  onSearchChange,
  onSearchSubmit,
  filter,
  actions,
}: ListToolbarProps) => {
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <div className="admin-toolbar">
      <form className="admin-search" onSubmit={submit} role="search">
        <Search size={ICON_SIZE.md} aria-hidden />
        <input
          type="text"
          inputMode="search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          maxLength={SEARCH_MAX_LENGTH}
        />
        {searchValue && (
          <button
            type="button"
            className="admin-search-clear"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            <X size={ICON_SIZE.md} />
          </button>
        )}
      </form>

      {filter && (
        <label className="admin-filter">
          <span>{filter.label}</span>
          <select
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
          >
            {filter.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      )}

      {actions && <div className="admin-toolbar-actions">{actions}</div>}
    </div>
  );
};

export default ListToolbar;
