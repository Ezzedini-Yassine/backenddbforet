-- Sample region (Île-de-France)
INSERT INTO admin_boundary (name, code, level, geometry) VALUES
(
  'Île-de-France',
  '11',
  'region',
  ST_GeomFromText('POLYGON((...))', 4326)
) ON CONFLICT (code, level) DO NOTHING;

-- Sample department (Paris)
INSERT INTO admin_boundary (name, code, level, parent_code, geometry) VALUES
(
  'Paris',
  '75',
  'department',
  '11',
  ST_GeomFromText('POLYGON((...))', 4326)
) ON CONFLICT (code, level) DO NOTHING;