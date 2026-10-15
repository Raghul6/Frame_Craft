import type { PoolClient } from "pg";
import { query, withTransaction } from "../config/db.js";
import { CM2_PER_IN2 } from "../constants/admin.js";
import type {
  Frame,
  FrameFilters,
  FrameInput,
  FrameSizeInput,
  PageParams,
  Paginated,
} from "../types/admin.js";
import type { CountedRow, FrameRow } from "../types/db.js";
import { withDbErrors } from "../utils/databaseError.js";
import {
  containsPattern,
  paginate,
  SqlParams,
  whereClause,
} from "../utils/sql.js";

const toFrame = (row: FrameRow): Frame => ({
  id: row.id,
  name: row.name,
  description: row.description,
  material: row.material,
  color: row.color,
  imageUrl: row.image_url,
  isActive: row.is_active,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  sizes: row.sizes,
});

// Sizes come back as a JSON array, smallest area first (cm converted to inches for
// comparison). NUMERIC is cast to float so the JSON holds numbers.
const FRAME_COLUMNS = `
  f.id, f.name, f.description, f.material, f.color, f.image_url, f.is_active, f.created_at, f.updated_at,
  COALESCE((
    SELECT json_agg(json_build_object(
             'id', s.id, 'label', s.label, 'width', s.width::float, 'height', s.height::float,
             'unit', s.unit, 'price', s.price::float, 'stock', s.stock)
           ORDER BY s.width * s.height / (CASE s.unit WHEN 'cm' THEN ${CM2_PER_IN2} ELSE 1 END), s.id)
    FROM frame_sizes s WHERE s.frame_id = f.id
  ), '[]'::json) AS sizes`;

export const listFrames = (
  filters: FrameFilters,
  page: PageParams,
): Promise<Paginated<Frame>> =>
  withDbErrors("listFrames", () => {
    const params = new SqlParams();
    const conditions: string[] = [];
    if (filters.search) {
      const pattern = params.add(containsPattern(filters.search));
      conditions.push(
        `(f.name ILIKE ${pattern} OR f.material ILIKE ${pattern} OR f.color ILIKE ${pattern})`,
      );
    }
    if (filters.status)
      conditions.push(
        `f.is_active = ${params.add(filters.status === "active")}`,
      );
    const where = whereClause(conditions);

    return paginate<FrameRow & CountedRow, Frame>(
      `SELECT ${FRAME_COLUMNS}, COUNT(*) OVER () AS total_count
       FROM frames f ${where}
       ORDER BY f.created_at DESC, f.id DESC`,
      `SELECT COUNT(*) AS total FROM frames f ${where}`,
      params,
      page,
      toFrame,
    );
  });

const selectFrame = async (id: number, client?: PoolClient) => {
  const sql = `SELECT ${FRAME_COLUMNS} FROM frames f WHERE f.id = $1`;
  const { rows } = client
    ? await client.query<FrameRow>(sql, [id])
    : await query<FrameRow>(sql, [id]);
  return rows[0] ? toFrame(rows[0]) : null;
};

export const findFrameById = (id: number) =>
  withDbErrors("findFrameById", () => selectFrame(id));

/** Column arrays for `unnest`, so any number of sizes is written in a single statement. */
const sizeColumns = (sizes: FrameSizeInput[]) => [
  sizes.map((s) => s.label),
  sizes.map((s) => s.width),
  sizes.map((s) => s.height),
  sizes.map((s) => s.unit),
  sizes.map((s) => s.price),
  sizes.map((s) => s.stock),
];

const insertSizes = async (
  client: PoolClient,
  frameId: number,
  sizes: FrameSizeInput[],
) => {
  if (sizes.length === 0) return;
  await client.query(
    `INSERT INTO frame_sizes (frame_id, label, width, height, unit, price, stock)
     SELECT $1, * FROM unnest($2::text[], $3::numeric[], $4::numeric[], $5::text[], $6::numeric[], $7::int[])`,
    [frameId, ...sizeColumns(sizes)],
  );
};

const frameValues = (input: FrameInput) => [
  input.name,
  input.description,
  input.material,
  input.color,
  input.imageUrl,
  input.isActive,
];

export const createFrame = (input: FrameInput) =>
  withDbErrors("createFrame", () =>
    withTransaction(async (client) => {
      const { rows } = await client.query<{ id: number }>(
        `INSERT INTO frames (name, description, material, color, image_url, is_active)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        frameValues(input),
      );
      await insertSizes(client, rows[0].id, input.sizes);
      return (await selectFrame(rows[0].id, client))!;
    }),
  );

/**
 * Updates a frame and syncs its sizes in three set-based statements: sizes missing from
 * the list are deleted, sizes with an `id` are updated, the rest are inserted.
 * Returns null when the frame doesn't exist.
 */
export const updateFrame = (id: number, input: FrameInput) =>
  withDbErrors("updateFrame", () =>
    withTransaction(async (client) => {
      const updated = await client.query(
        `UPDATE frames
           SET name = $2, description = $3, material = $4, color = $5, image_url = $6,
               is_active = $7, updated_at = NOW()
         WHERE id = $1`,
        [id, ...frameValues(input)],
      );
      if (updated.rowCount === 0) return null;

      const existing = input.sizes.filter((s) => s.id);
      await client.query(
        "DELETE FROM frame_sizes WHERE frame_id = $1 AND NOT (id = ANY($2::int[]))",
        [id, existing.map((s) => s.id)],
      );

      let updatedIds = new Set<number>();
      if (existing.length) {
        const { rows } = await client.query<{ id: number }>(
          `UPDATE frame_sizes s
             SET label = v.label, width = v.width, height = v.height, unit = v.unit,
                 price = v.price, stock = v.stock
           FROM unnest($2::int[], $3::text[], $4::numeric[], $5::numeric[], $6::text[], $7::numeric[], $8::int[])
             AS v(id, label, width, height, unit, price, stock)
           WHERE s.id = v.id AND s.frame_id = $1
           RETURNING s.id`,
          [id, existing.map((s) => s.id), ...sizeColumns(existing)],
        );
        updatedIds = new Set(rows.map((r) => r.id));
      }

      // New sizes, plus any id that belonged to another frame (treated as new).
      await insertSizes(
        client,
        id,
        input.sizes.filter((s) => !s.id || !updatedIds.has(s.id)),
      );

      return selectFrame(id, client);
    }),
  );

export const deleteFrame = (id: number) =>
  withDbErrors("deleteFrame", async () => {
    const { rowCount } = await query("DELETE FROM frames WHERE id = $1", [id]);
    return (rowCount ?? 0) > 0;
  });
