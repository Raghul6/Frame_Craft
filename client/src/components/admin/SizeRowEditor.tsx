import { Trash2 } from "lucide-react";
import {
  FRAME_FIELD_LIMITS,
  SIZE_NUMBER_MAX_LENGTH,
  SIZE_UNITS,
} from "../../constants/admin";
import type { SizeUnit } from "../../types/admin";
import type { SizeRowEditorProps } from "../../types/components";
import { autoSizeLabel } from "../../utils/frameForm";
import { ICON_SIZE } from "../../constants/ui";

/** One editable size (width × height, unit, label, price, stock) in the frame form. */
const SizeRowEditor = ({
  row,
  index,
  errors,
  onChange,
  onRemove,
}: SizeRowEditorProps) => {
  const n = index + 1;
  const numberCell = (
    field: "width" | "height" | "price" | "stock",
    label: string,
    inputMode: "decimal" | "numeric",
    placeholder?: string,
  ) => (
    <label className="size-cell">
      <span className="size-cell-label">{label}</span>
      <input
        inputMode={inputMode}
        value={row[field]}
        onChange={(e) => onChange(row.key, { [field]: e.target.value })}
        aria-invalid={!!errors[field]}
        aria-label={`Size ${n} ${field}`}
        placeholder={placeholder}
        maxLength={SIZE_NUMBER_MAX_LENGTH}
      />
      {errors[field] && <span className="field-error">{errors[field]}</span>}
    </label>
  );

  return (
    <div className="size-row">
      {numberCell("width", "Width", "decimal")}
      <span className="size-times" aria-hidden>
        ×
      </span>
      {numberCell("height", "Height", "decimal")}
      <label className="size-cell">
        <span className="size-cell-label">Unit</span>
        <select
          value={row.unit}
          onChange={(e) =>
            onChange(row.key, { unit: e.target.value as SizeUnit })
          }
          aria-label={`Size ${n} unit`}
        >
          {SIZE_UNITS.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </label>
      <label className="size-cell">
        <span className="size-cell-label">Label</span>
        <input
          value={row.label}
          onChange={(e) => onChange(row.key, { label: e.target.value })}
          placeholder={autoSizeLabel(row)}
          maxLength={FRAME_FIELD_LIMITS.label}
          aria-label={`Size ${n} label`}
        />
      </label>
      {numberCell("price", "Price ($)", "decimal", "0.00")}
      {numberCell("stock", "Stock", "numeric")}
      <button
        type="button"
        className="icon-action danger size-remove"
        onClick={() => onRemove(row.key)}
        aria-label={`Remove size ${n}`}
      >
        <Trash2 size={ICON_SIZE.action} />
      </button>
    </div>
  );
};

export default SizeRowEditor;
