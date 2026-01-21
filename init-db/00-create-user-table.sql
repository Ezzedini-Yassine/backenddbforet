-- 00-create-user-table.sql
-- Creates the "user" table matching our TypeORM User entity + BaseEntity fields
-- IMPORTANT: Table name is quoted because "user" is a reserved word in PostgreSQL

CREATE TABLE IF NOT EXISTS "user" (
    -- From BaseEntity
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by      VARCHAR(255),                    -- nullable: true
    created_date    TIMESTAMP WITH TIME ZONE,        -- nullable: true
    last_modified_by VARCHAR(255),                   -- nullable: true
    last_modified_date TIMESTAMP WITH TIME ZONE,     -- nullable: true
    activated       BOOLEAN DEFAULT TRUE,            -- default: true

    -- From User entity
    username        VARCHAR(255) UNIQUE NOT NULL,
    phone_number    VARCHAR(50),                     -- nullable: true
    email           VARCHAR(255) UNIQUE NOT NULL,
    password        VARCHAR(255) NOT NULL,
    roles           VARCHAR(20) NOT NULL             -- we'll use CHECK constraint below
        CHECK (roles IN ('companyadmin', 'freeuser', 'paiduser')),
    image_url       VARCHAR(500),                    -- nullable: true
    lang_key        VARCHAR(10) DEFAULT 'en',        -- default: 'en'
    refresh_token   VARCHAR(512)                     -- nullable: true
);

-- Optional: create a regular index on email (already unique, but sometimes helpful)
CREATE INDEX IF NOT EXISTS idx_user_email ON "user" (email);

-- Optional: index on username (also unique)
CREATE INDEX IF NOT EXISTS idx_user_username ON "user" (username);

-- Optional: index for roles if you frequently filter by role
CREATE INDEX IF NOT EXISTS idx_user_roles ON "user" (roles);