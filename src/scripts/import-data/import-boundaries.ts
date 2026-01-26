import { DataSource } from 'typeorm';
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Import French administrative boundaries into PostgreSQL
 * Imports: Regions, Departments, Communes, Lieux-dits
 */

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433'),
  database: process.env.DB_NAME || 'forest_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
};

const DATA_DIR = path.join(__dirname, '../../data/boundaries/admin_express');

// Map shapefile names to admin levels
const BOUNDARY_LAYERS = [
  { file: 'REGION', level: 'region', nameField: 'NOM_REG', codeField: 'CODE_REG' },
  { file: 'DEPARTEMENT', level: 'department', nameField: 'NOM_DEP', codeField: 'CODE_DEP' },
  { file: 'COMMUNE', level: 'commune', nameField: 'NOM_COM', codeField: 'CODE_COM' },
  { file: 'ARRONDISSEMENT', level: 'arrondissement', nameField: 'NOM_ARR', codeField: 'CODE_ARR' },
];

async function importBoundaries() {
  console.log('🗺️  Starting administrative boundaries import...');
  
  // Check if data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`❌ Data directory not found: ${DATA_DIR}`);
    console.log('💡 Run the download script first: ./src/scripts/download-data/download-admin-boundaries.sh');
    process.exit(1);
  }

  // Find all shapefiles
  const shapefiles = findShapefiles(DATA_DIR);
  console.log(`📁 Found ${shapefiles.length} shapefile(s)`);

  // Process each boundary layer in order (region -> department -> commune)
  for (const layer of BOUNDARY_LAYERS) {
    const shapefile = shapefiles.find(f => 
      f.toUpperCase().includes(layer.file)
    );

    if (!shapefile) {
      console.warn(`⚠️  Shapefile not found for ${layer.level}`);
      continue;
    }

    console.log(`\n📥 Importing ${layer.level}s from ${path.basename(shapefile)}`);

    try {
      const command = buildOgr2ogrCommand(shapefile, layer);
      
      console.log(`🔧 Running ogr2ogr...`);
      execSync(command, { stdio: 'inherit' });
      
      console.log(`✅ Successfully imported ${layer.level}s`);
    } catch (error) {
      console.error(`❌ Failed to import ${layer.level}:`, error.message);
    }
  }

  console.log('\n✨ Administrative boundaries import complete!');
  
  // Show summary
  await showImportSummary();
}

function findShapefiles(directory: string): string[] {
  const shapefiles: string[] = [];
  
  function searchRecursive(dir: string) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        searchRecursive(fullPath);
      } else if (entry.name.endsWith('.shp')) {
        shapefiles.push(fullPath);
      }
    }
  }
  
  searchRecursive(directory);
  return shapefiles;
}

function buildOgr2ogrCommand(
  shapefile: string, 
  layer: typeof BOUNDARY_LAYERS[0]
): string {
  const { host, port, database, username, password } = DB_CONFIG;
  
  const pgConnection = `PG:host=${host} port=${port} dbname=${database} user=${username} password=${password}`;
  
  // SQL to map shapefile fields to our admin_boundary table
  const sql = `-sql "SELECT ${layer.codeField} as code, ${layer.nameField} as name, '${layer.level}' as level, geometry FROM ${layer.file}"`;
  
  return `ogr2ogr -f "PostgreSQL" "${pgConnection}" \
    "${shapefile}" \
    ${sql} \
    -nln admin_boundary \
    -append \
    -t_srs EPSG:4326 \
    -lco GEOMETRY_NAME=geometry \
    -lco SPATIAL_INDEX=GIST \
    --config PG_USE_COPY YES`;
}

async function showImportSummary() {
  try {
    const dataSource = new DataSource({
      type: 'postgres',
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      username: DB_CONFIG.username,
      password: DB_CONFIG.password,
      database: DB_CONFIG.database,
    });

    await dataSource.initialize();

    const results = await dataSource.query(`
      SELECT level, COUNT(*) as count 
      FROM admin_boundary 
      GROUP BY level 
      ORDER BY 
        CASE level
          WHEN 'region' THEN 1
          WHEN 'department' THEN 2
          WHEN 'arrondissement' THEN 3
          WHEN 'commune' THEN 4
          ELSE 5
        END;
    `);

    console.log(`\n📊 Import Summary:`);
    results.forEach((row: any) => {
      console.log(`   ${row.level}: ${row.count} records`);
    });

    await dataSource.destroy();
  } catch (error) {
    console.warn('⚠️  Could not fetch summary:', error.message);
  }
}

// Run the import
importBoundaries().catch(error => {
  console.error('❌ Import failed:', error);
  process.exit(1);
});