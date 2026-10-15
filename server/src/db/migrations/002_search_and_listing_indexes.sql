-- 002: indexes for admin search and newest-first listings, and a deferrable size constraint.

-- Trigram indexes let `ILIKE '%term%'` searches use an index instead of scanning every row.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS users_username_trgm_idx ON users USING gin (username gin_trgm_ops);
CREATE INDEX IF NOT EXISTS users_email_trgm_idx ON users USING gin (email gin_trgm_ops);
CREATE INDEX IF NOT EXISTS users_mobile_trgm_idx ON users USING gin (mobile gin_trgm_ops);
CREATE INDEX IF NOT EXISTS frames_name_trgm_idx ON frames USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS frames_material_trgm_idx ON frames USING gin (material gin_trgm_ops);
CREATE INDEX IF NOT EXISTS frames_color_trgm_idx ON frames USING gin (color gin_trgm_ops);

-- Every admin list is "newest first, then id"; these serve ORDER BY + LIMIT directly.
CREATE INDEX IF NOT EXISTS users_created_idx ON users (created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS frames_created_idx ON frames (created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS orders_created_idx ON orders (created_at DESC, id DESC);
-- A user's order history (user detail page) — replaces the plain user_id index.
CREATE INDEX IF NOT EXISTS orders_user_created_idx ON orders (user_id, created_at DESC, id DESC);
DROP INDEX IF EXISTS orders_user_idx;

-- Checked at COMMIT instead of per row, so editing a frame can swap two sizes'
-- dimensions in one save without a false "duplicate size" error.
ALTER TABLE frame_sizes DROP CONSTRAINT IF EXISTS frame_sizes_unique_dimensions;
ALTER TABLE frame_sizes ADD CONSTRAINT frame_sizes_unique_dimensions
  UNIQUE (frame_id, width, height, unit) DEFERRABLE INITIALLY DEFERRED;
