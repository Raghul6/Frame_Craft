import {
  FRAME_COLOR_MAX_LENGTH,
  FRAME_DESCRIPTION_MAX_LENGTH,
  FRAME_IMAGE_URL_MAX_LENGTH,
  FRAME_MATERIAL_MAX_LENGTH,
  FRAME_NAME_MAX_LENGTH,
  MAX_SIZE_DIMENSION,
  MAX_SIZE_PRICE,
  MAX_SIZES_PER_FRAME,
  SIZE_LABEL_MAX_LENGTH,
} from "../constants/admin.js";
import type { FrameInput, FrameSizeInput, SizeUnit } from "../types/admin.js";
import type { FieldErrors } from "../types/auth.js";

const str = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const num = (value: unknown) => {
  const n =
    typeof value === "string" && value.trim() !== "" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) ? n : NaN;
};

const trimNumber = (n: number) => String(Number(n.toFixed(2)));

const defaultSizeLabel = (width: number, height: number, unit: SizeUnit) =>
  `${trimNumber(width)} x ${trimNumber(height)} ${unit}`;

/**
 * Validates the admin frame form. Size errors are keyed `sizes.<index>.<field>`
 * so the client can show them next to the right row.
 */
export function validateFrame(body: Record<string, unknown>): {
  errors: FieldErrors;
  data: FrameInput;
} {
  const errors: FieldErrors = {};

  const name = str(body.name, FRAME_NAME_MAX_LENGTH);
  if (!name) errors.name = "Frame name is required";

  const imageUrl = str(body.imageUrl, FRAME_IMAGE_URL_MAX_LENGTH) || null;
  if (imageUrl && !/^https?:\/\/\S+$/i.test(imageUrl))
    errors.imageUrl = "Image URL must start with http:// or https://";

  const rawSizes = Array.isArray(body.sizes) ? body.sizes : [];
  if (rawSizes.length === 0) errors.sizes = "Add at least one size";
  if (rawSizes.length > MAX_SIZES_PER_FRAME)
    errors.sizes = `A frame can have at most ${MAX_SIZES_PER_FRAME} sizes`;

  const seen = new Set<string>();
  const sizes: FrameSizeInput[] = rawSizes
    .slice(0, MAX_SIZES_PER_FRAME)
    .map((raw, i) => {
      const s = (typeof raw === "object" && raw !== null ? raw : {}) as Record<
        string,
        unknown
      >;
      const key = (field: string) => `sizes.${i}.${field}`;

      const unit: SizeUnit = s.unit === "cm" ? "cm" : "in";
      const width = num(s.width);
      const height = num(s.height);
      const price = num(s.price);
      const stock = s.stock === undefined || s.stock === "" ? 0 : num(s.stock);
      const id = num(s.id);

      if (!(width > 0) || width > MAX_SIZE_DIMENSION)
        errors[key("width")] = "Enter a width greater than 0";
      if (!(height > 0) || height > MAX_SIZE_DIMENSION)
        errors[key("height")] = "Enter a height greater than 0";
      if (!(price >= 0) || price > MAX_SIZE_PRICE)
        errors[key("price")] = "Enter a valid price";
      if (!Number.isInteger(stock) || stock < 0)
        errors[key("stock")] = "Stock must be a whole number ≥ 0";

      if (width > 0 && height > 0) {
        const dims = `${trimNumber(width)}x${trimNumber(height)}${unit}`;
        if (seen.has(dims)) errors[key("width")] = "This size is listed twice";
        seen.add(dims);
      }

      return {
        id: Number.isInteger(id) && id > 0 ? id : undefined,
        label:
          str(s.label, SIZE_LABEL_MAX_LENGTH) ||
          (width > 0 && height > 0
            ? defaultSizeLabel(width, height, unit)
            : ""),
        width,
        height,
        unit,
        price: Math.round(price * 100) / 100,
        stock,
      };
    });

  return {
    errors,
    data: {
      name,
      description: str(body.description, FRAME_DESCRIPTION_MAX_LENGTH),
      material: str(body.material, FRAME_MATERIAL_MAX_LENGTH),
      color: str(body.color, FRAME_COLOR_MAX_LENGTH),
      imageUrl,
      isActive: body.isActive !== false,
      sizes,
    },
  };
}
