import {
  DEFAULT_SIZE_STOCK,
  DEFAULT_SIZE_UNIT,
  IMAGE_URL_REGEX,
  SIZE_LABEL_PLACEHOLDER,
} from "../constants/admin";
import type { Frame, FrameInput, SizePreset, SizeUnit } from "../types/admin";
import type { FieldErrors } from "../types/api";
import type { FrameFormState, SizeRow } from "../types/forms";
import { VALIDATION_MESSAGES } from "../constants/messages";

// Pure helpers for the add/edit frame form, kept out of the page component.

let keySeq = 0;
const newRowKey = () => `row-${++keySeq}`;

/** "  " and "abc" are not numbers here (Number("  ") would be 0). */
const toNumber = (value: string): number =>
  value.trim() === "" ? Number.NaN : Number(value);

export const emptySizeRow = (preset?: SizePreset): SizeRow => ({
  key: newRowKey(),
  label: preset?.label ?? "",
  width: preset ? String(preset.width) : "",
  height: preset ? String(preset.height) : "",
  unit: preset?.unit ?? DEFAULT_SIZE_UNIT,
  price: "",
  stock: DEFAULT_SIZE_STOCK,
});

export const createEmptyFrameForm = (): FrameFormState => ({
  name: "",
  description: "",
  material: "",
  color: "",
  imageUrl: "",
  isActive: true,
  sizes: [emptySizeRow()],
});

export const frameToForm = (frame: Frame): FrameFormState => ({
  name: frame.name,
  description: frame.description,
  material: frame.material,
  color: frame.color,
  imageUrl: frame.imageUrl ?? "",
  isActive: frame.isActive,
  sizes: frame.sizes.map((size) => ({
    key: newRowKey(),
    id: size.id,
    label: size.label,
    width: String(size.width),
    height: String(size.height),
    unit: size.unit,
    price: String(size.price),
    stock: String(size.stock),
  })),
});

/** Same width × height × unit = same size (used for duplicates and preset chips). */
export const sizeKey = (
  width: string | number,
  height: string | number,
  unit: SizeUnit,
) => `${Number(width)}x${Number(height)}${unit}`;

export const autoSizeLabel = (row: SizeRow): string => {
  const width = toNumber(row.width);
  const height = toNumber(row.height);
  return width > 0 && height > 0
    ? `${width} x ${height} ${row.unit}`
    : SIZE_LABEL_PLACEHOLDER;
};

export const presetChipText = (preset: SizePreset): string =>
  preset.short ??
  `${preset.width}×${preset.height}${preset.unit === "in" ? "″" : ` ${preset.unit}`}`;

/** Client-side checks mirroring the server's; size errors are keyed `sizes.<index>.<field>`. */
export const validateFrameForm = (form: FrameFormState): FieldErrors => {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = VALIDATION_MESSAGES.frameNameRequired;
  const imageUrl = form.imageUrl.trim();
  if (imageUrl && !IMAGE_URL_REGEX.test(imageUrl)) {
    errors.imageUrl = VALIDATION_MESSAGES.imageUrlInvalid;
  }
  if (form.sizes.length === 0) errors.sizes = VALIDATION_MESSAGES.sizesRequired;

  const seen = new Set<string>();
  form.sizes.forEach((row, i) => {
    const width = toNumber(row.width);
    const height = toNumber(row.height);
    const price = toNumber(row.price);
    const stock = row.stock.trim() === "" ? 0 : toNumber(row.stock);

    if (!(width > 0))
      errors[`sizes.${i}.width`] = VALIDATION_MESSAGES.widthInvalid;
    if (!(height > 0))
      errors[`sizes.${i}.height`] = VALIDATION_MESSAGES.heightInvalid;
    if (!(price >= 0))
      errors[`sizes.${i}.price`] = VALIDATION_MESSAGES.priceRequired;
    if (!Number.isInteger(stock) || stock < 0)
      errors[`sizes.${i}.stock`] = VALIDATION_MESSAGES.stockInvalid;

    if (width > 0 && height > 0) {
      const key = sizeKey(width, height, row.unit);
      if (seen.has(key))
        errors[`sizes.${i}.width`] = VALIDATION_MESSAGES.sizeDuplicate;
      seen.add(key);
    }
  });
  return errors;
};

export const formToFrameInput = (form: FrameFormState): FrameInput => ({
  name: form.name.trim(),
  description: form.description.trim(),
  material: form.material.trim(),
  color: form.color.trim(),
  imageUrl: form.imageUrl.trim(),
  isActive: form.isActive,
  sizes: form.sizes.map((row) => ({
    id: row.id,
    label: row.label.trim(),
    width: toNumber(row.width),
    height: toNumber(row.height),
    unit: row.unit,
    price: toNumber(row.price),
    stock: row.stock.trim() === "" ? 0 : toNumber(row.stock),
  })),
});

/** Lowest entered price, or null when none is entered yet. */
export const lowestPrice = (form: FrameFormState): number | null => {
  const prices = form.sizes
    .map((row) => toNumber(row.price))
    .filter((p) => p >= 0);
  return prices.length ? Math.min(...prices) : null;
};
