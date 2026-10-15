-- 001: users, frames + sizes, orders + items. Written to be safe on databases created before migrations existed.

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(30)  NOT NULL,
  email         VARCHAR(255),
  mobile        VARCHAR(15),
  password_hash TEXT         NOT NULL,
  role          user_role    NOT NULL DEFAULT 'customer',
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT users_contact_required CHECK (email IS NOT NULL OR mobile IS NOT NULL)
);

-- Case-insensitive uniqueness for username and email
CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower_idx ON users (LOWER(username));
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (LOWER(email)) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS users_mobile_idx ON users (mobile) WHERE mobile IS NOT NULL;

-- Admin accounts don't need an email or mobile; customers still must have one.
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_contact_required;
ALTER TABLE users ADD CONSTRAINT users_contact_required
  CHECK (role = 'admin' OR email IS NOT NULL OR mobile IS NOT NULL);

-- ---------- Frames ----------
CREATE TABLE IF NOT EXISTS frames (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  description TEXT         NOT NULL DEFAULT '',
  material    VARCHAR(60)  NOT NULL DEFAULT '',
  color       VARCHAR(60)  NOT NULL DEFAULT '',
  image_url   TEXT,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Each frame is sold in one or more sizes, each with its own price and stock.
CREATE TABLE IF NOT EXISTS frame_sizes (
  id        SERIAL PRIMARY KEY,
  frame_id  INT           NOT NULL REFERENCES frames(id) ON DELETE CASCADE,
  label     VARCHAR(40)   NOT NULL,
  width     NUMERIC(6,2)  NOT NULL CHECK (width > 0),
  height    NUMERIC(6,2)  NOT NULL CHECK (height > 0),
  unit      VARCHAR(2)    NOT NULL DEFAULT 'in' CHECK (unit IN ('in', 'cm')),
  price     NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  stock     INT           NOT NULL DEFAULT 0 CHECK (stock >= 0),
  CONSTRAINT frame_sizes_unique_dimensions UNIQUE (frame_id, width, height, unit)
);
CREATE INDEX IF NOT EXISTS frame_sizes_frame_idx ON frame_sizes (frame_id);

-- ---------- Orders ----------
DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS orders (
  id               SERIAL PRIMARY KEY,
  user_id          INT           NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status           order_status  NOT NULL DEFAULT 'pending',
  total            NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_name    VARCHAR(120)  NOT NULL DEFAULT '',
  shipping_phone   VARCHAR(20)   NOT NULL DEFAULT '',
  shipping_address TEXT          NOT NULL DEFAULT '',
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS orders_user_idx ON orders (user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);

-- Name, size and price are copied at purchase time so later frame edits don't rewrite history.
CREATE TABLE IF NOT EXISTS order_items (
  id            SERIAL PRIMARY KEY,
  order_id      INT           NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  frame_id      INT           REFERENCES frames(id) ON DELETE SET NULL,
  frame_size_id INT           REFERENCES frame_sizes(id) ON DELETE SET NULL,
  frame_name    VARCHAR(120)  NOT NULL,
  size_label    VARCHAR(40)   NOT NULL,
  unit_price    NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  quantity      INT           NOT NULL CHECK (quantity > 0)
);
CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items (order_id);
