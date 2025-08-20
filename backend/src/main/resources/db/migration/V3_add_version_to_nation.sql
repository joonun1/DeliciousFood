-- users 테이블에 nation 컬럼 추가 (최소 변경: NULL 허용)
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS nation VARCHAR(50);
