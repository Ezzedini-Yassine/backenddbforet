-- 00-create-user-table.sql
-- Creates the "user" table matching our TypeORM User entity + BaseEntity fields
-- IMPORTANT: Table name is quoted because "user" is a reserved word in PostgreSQL

CREATE TABLE IF NOT EXISTS "user" (
    -- BaseEntity fields (camelCase as in entity)
    "id"                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "createdBy"         VARCHAR(255),
    "createdDate"       TIMESTAMP WITH TIME ZONE,
    "lastModifiedBy"    VARCHAR(255),
    "lastModifiedDate"  TIMESTAMP WITH TIME ZONE,
    "activated"         BOOLEAN DEFAULT TRUE,

    -- User entity fields
    "username"          VARCHAR(255) UNIQUE NOT NULL,
    "phoneNumber"       VARCHAR(50),
    "email"             VARCHAR(255) UNIQUE NOT NULL,
    "password"          VARCHAR(255) NOT NULL,
    "roles"             VARCHAR(20) NOT NULL
        CHECK ("roles" IN ('companyadmin', 'freeuser', 'paiduser')),
    "imageUrl"          VARCHAR(500),
    "langKey"           VARCHAR(10) DEFAULT 'en',
    "refreshToken"      VARCHAR(512)
);

-- Optional: create a regular index on email (already unique, but sometimes helpful)
CREATE INDEX IF NOT EXISTS idx_user_email      ON "user" ("email");
-- Optional: index on username (also unique)
CREATE INDEX IF NOT EXISTS idx_user_username   ON "user" ("username");
-- Optional: index for roles if you frequently filter by role
CREATE INDEX IF NOT EXISTS idx_user_roles      ON "user" ("roles");