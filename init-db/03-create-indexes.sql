-- Spatial indexes (CRITICAL for performance!)
CREATE INDEX idx_forest_data_geom ON forest_data USING GIST(geometry);
CREATE INDEX idx_admin_boundary_geom ON admin_boundary USING GIST(geometry);
CREATE INDEX idx_cadastre_parcel_geom ON cadastre_parcel USING GIST(geometry);

-- Regular indexes for common queries
CREATE INDEX idx_forest_data_department ON forest_data(department);
CREATE INDEX idx_admin_boundary_level ON admin_boundary(level);
CREATE INDEX idx_admin_boundary_code ON admin_boundary(code);
CREATE INDEX idx_map_state_user_id ON map_state(user_id);

-- Composite indexes
CREATE INDEX idx_admin_boundary_level_code ON admin_boundary(level, code);