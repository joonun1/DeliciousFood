-- 확장
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- gen_random_uuid()

-- users (샘플)
CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       email TEXT NOT NULL UNIQUE,
                       password_hash TEXT,
                       name TEXT,
                       created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- stores
CREATE TABLE stores (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        name TEXT NOT NULL,
                        address TEXT,
                        description TEXT,
                        rating_avg NUMERIC(3,2) DEFAULT 0,
                        rating_count INT DEFAULT 0,
                        geom GEOGRAPHY(POINT, 4326) NOT NULL,
                        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 인덱스
CREATE INDEX idx_stores_geom ON stores USING GIST (geom);
CREATE INDEX idx_stores_name_trgm ON stores USING GIN (name gin_trgm_ops);
