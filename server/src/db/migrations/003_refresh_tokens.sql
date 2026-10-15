-- 003: refresh-token sessions (httpOnly cookie). Only a SHA-256 hash of each token is stored.
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          BIGSERIAL    PRIMARY KEY,
  user_id     INT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  -- Every rotation of one login shares a family; reuse of an old token revokes the family.
  family_id   UUID         NOT NULL,
  token_hash  CHAR(64)     NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ  NOT NULL,
  revoked_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  user_agent  VARCHAR(255),
  ip          VARCHAR(64)
);

CREATE INDEX IF NOT EXISTS refresh_tokens_user_idx ON refresh_tokens (user_id);
CREATE INDEX IF NOT EXISTS refresh_tokens_family_idx ON refresh_tokens (family_id);
CREATE INDEX IF NOT EXISTS refresh_tokens_expires_idx ON refresh_tokens (expires_at);
