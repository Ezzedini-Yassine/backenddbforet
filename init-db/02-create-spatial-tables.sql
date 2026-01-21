-- Map State table (stores user's last map view)
CREATE TABLE IF NOT EXISTS map_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  center_lat DOUBLE PRECISION NOT NULL,
  center_lng DOUBLE PRECISION NOT NULL,
  zoom INTEGER NOT NULL,
  filters JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Forest Data table (BD Forêt®)
CREATE TABLE IF NOT EXISTS forest_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code_tfv VARCHAR(50), -- Type forestier
  libelle_fr VARCHAR(255), -- Tree species name in French
  tfv_g11 VARCHAR(50), -- Groupe de formation végétale
  essence_1 VARCHAR(100), -- Dominant species
  essence_2 VARCHAR(100), -- Secondary species
  essence_3 VARCHAR(100), -- Tertiary species
  area_ha DOUBLE PRECISION, -- Area in hectares
  department VARCHAR(3), -- Department code (e.g., '75')
  geometry GEOMETRY(MultiPolygon, 4326) NOT NULL, -- WGS84
  created_at TIMESTAMP DEFAULT NOW()
);

-- Administrative Boundaries (Regions, Departments, Communes, Lieux-dit)
CREATE TABLE IF NOT EXISTS admin_boundary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL, -- e.g., "Île-de-France", "Paris"
  code VARCHAR(10) NOT NULL, -- INSEE code
  level VARCHAR(20) NOT NULL CHECK (level IN ('region', 'department', 'commune', 'lieuxdit')),
  parent_code VARCHAR(10), -- Link to parent level
  population INTEGER,
  geometry GEOMETRY(MultiPolygon, 4326) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(code, level)
);

CREATE TABLE IF NOT EXISTS cadastre_parcel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id VARCHAR(50) NOT NULL UNIQUE, -- Cadastre parcel identifier
  commune_code VARCHAR(10),
  section VARCHAR(5),
  numero VARCHAR(10),
  area_m2 DOUBLE PRECISION,
  geometry GEOMETRY(MultiPolygon, 4326) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);