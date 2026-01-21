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

-- Sample region (Provence-Alpes-Côte d'Azur)
INSERT INTO admin_boundary (name, code, level, geometry) VALUES
(
  'Provence-Alpes-Côte d''Azur',
  '93',
  'region',
  ST_GeomFromText('POLYGON((4.2285 43.1791, 7.7187 43.1791, 7.7187 44.9747, 4.2285 44.9747, 4.2285 43.1791))', 4326)
) ON CONFLICT (code, level) DO NOTHING;

-- Sample department (Bouches-du-Rhône)
INSERT INTO admin_boundary (name, code, level, parent_code, geometry) VALUES
(
  'Bouches-du-Rhône',
  '13',
  'department',
  '93',
  ST_GeomFromText('POLYGON((4.6343 43.1598, 5.8086 43.1598, 5.8086 43.7604, 4.6343 43.7604, 4.6343 43.1598))', 4326)
) ON CONFLICT (code, level) DO NOTHING;

-- Sample department (Alpes-Maritimes)
INSERT INTO admin_boundary (name, code, level, parent_code, geometry) VALUES
(
  'Alpes-Maritimes',
  '06',
  'department',
  '93',
  ST_GeomFromText('POLYGON((6.6523 43.4753, 7.7070 43.4753, 7.7070 44.3628, 6.6523 44.3628, 6.6523 43.4753))', 4326)
) ON CONFLICT (code, level) DO NOTHING;

-- Sample region (Auvergne-Rhône-Alpes)
INSERT INTO admin_boundary (name, code, level, geometry) VALUES
(
  'Auvergne-Rhône-Alpes',
  '84',
  'region',
  ST_GeomFromText('POLYGON((2.0410 44.1207, 7.1777 44.1207, 7.1777 46.5163, 2.0410 46.5163, 2.0410 44.1207))', 4326)
) ON CONFLICT (code, level) DO NOTHING;

-- Sample department (Rhône)
INSERT INTO admin_boundary (name, code, level, parent_code, geometry) VALUES
(
  'Rhône',
  '69',
  'department',
  '84',
  ST_GeomFromText('POLYGON((4.2456 45.4547, 4.9951 45.4547, 4.9951 46.1458, 4.2456 46.1458, 4.2456 45.4547))', 4326)
) ON CONFLICT (code, level) DO NOTHING;

-- Sample department (Hauts-de-Seine)
INSERT INTO admin_boundary (name, code, level, parent_code, geometry) VALUES
(
  'Hauts-de-Seine',
  '92',
  'department',
  '11',
  ST_GeomFromText('POLYGON((2.1484 48.7369, 2.3320 48.7369, 2.3320 48.9492, 2.1484 48.9492, 2.1484 48.7369))', 4326)
) ON CONFLICT (code, level) DO NOTHING;