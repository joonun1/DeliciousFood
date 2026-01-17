-- 확장 (Supabase에서도 사용 가능)
create extension if not exists postgis;
create extension if not exists pg_trgm;
create extension if not exists pgcrypto; -- gen_random_uuid()

-- users
create table if not exists users (
                                     id uuid primary key default gen_random_uuid(),
    email text not null unique,
    password_hash text,
    name text,
    created_at timestamptz not null default now()
    );

-- stores
create table if not exists stores (
                                      id uuid primary key default gen_random_uuid(),
    name text not null,
    address text,
    description text,
    rating_avg numeric(3,2) default 0,
    rating_count int default 0,
    geom geography(point, 4326) not null,
    created_at timestamptz not null default now()
    );
create index if not exists idx_stores_geom on stores using gist (geom);
create index if not exists idx_stores_name_trgm on stores using gin (name gin_trgm_ops);

-- reviews (평가)
create table if not exists reviews (
                                       id uuid primary key default gen_random_uuid(),
    store_id uuid not null references stores(id) on delete cascade,
    user_id uuid not null references users(id) on delete cascade,
    rating int not null check (rating between 1 and 5),
    content text,
    created_at timestamptz not null default now()
    );

-- ⭐ 평점 자동 집계 트리거
create or replace function recalc_store_rating() returns trigger as $$
begin
update stores s set
                    rating_count = sub.cnt,
                    rating_avg   = round(sub.avg::numeric, 2)
    from (
    select store_id, count(*) as cnt, avg(rating)::numeric as avg
    from reviews where store_id = new.store_id group by store_id
  ) sub
where s.id = sub.store_id;
return null;
end; $$ language plpgsql;

drop trigger if exists trg_reviews_recalc on reviews;
create trigger trg_reviews_recalc
    after insert or update or delete on reviews
    for each row execute function recalc_store_rating();
