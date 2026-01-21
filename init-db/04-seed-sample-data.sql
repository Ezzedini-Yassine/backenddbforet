-- Sample region (Île-de-France)
INSERT INTO admin_boundary (name, code, level, geometry) VALUES
(
  'Île-de-France',
  '11',
  'region',
  ST_GeomFromText('POLYGON((1.4461 48.1203, 3.5586 48.1203, 3.5586 49.2414, 1.4461 49.2414, 1.4461 48.1203))', 4326)
) ON CONFLICT (code, level) DO NOTHING;

-- Sample department (Paris)
INSERT INTO admin_boundary (name, code, level, parent_code, geometry) VALUES
(
  'Paris',
  '75',
  'department',
  '11',
  ST_GeomFromText('POLYGON((2.2241 48.8155, 2.4699 48.8155, 2.4699 48.9022, 2.2241 48.9022, 2.2241 48.8155))', 4326)
) ON CONFLICT (code, level) DO NOTHING;