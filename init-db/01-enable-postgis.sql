-- Without it, table creation will fail with a "function gen_random_uuid() does not exist" error.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Verify installation
SELECT PostGIS_Version();