import { DataSource } from 'typeorm';
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Import BD Forêt data into PostgreSQL using ogr2ogr
 * This script converts Shapefiles to PostGIS format
 */

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433'),
  database: process.env.DB_NAME || 'forest_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
};

const DATA_DIR = path.join(__dirname, '../../data/bdforet');

async function importBDForet() {
  console.log('🌲 Starting BD Forêt import...');
  
  // Check if data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`❌ Data directory not found: ${DATA_DIR}`);
    console.log('💡 Run the download script first: ./src/scripts/download-data/download-bdforet.sh');
    process.exit(1);
  }

  // Find all extracted department folders
  const deptFolders = fs.readdirSync(DATA_DIR)
    .filter(name => name.startsWith('dept_'))
    .map(name => path.join(DATA_DIR, name));

  if (deptFolders.length === 0) {
    console.error('❌ No extracted department folders found');
    process.exit(1);
  }

  console.log(`📁 Found ${deptFolders.length} department(s) to import`);

  for (const deptFolder of deptFolders) {
    console.log(`\n📂 Processing: ${path.basename(deptFolder)}`);
    
    // Find the shapefile (usually named FORMATION_VEGETALE.shp or similar)
    const shapefiles = findShapefiles(deptFolder);
    
    if (shapefiles.length === 0) {
      console.warn(`⚠️  No shapefiles found in ${deptFolder}`);
      continue;
    }

    // Import the main forest formation shapefile
    const forestShapefile = shapefiles.find(f => 
      f.includes('FORMATION') || f.includes('FORET')
    ) || shapefiles[0];

    console.log(`📥 Importing: ${path.basename(forestShapefile)}`);

    try {
      // Build ogr2ogr command
      const command = buildOgr2ogrCommand(forestShapefile);
      
      console.log(`🔧 Running: ogr2ogr...`);
      execSync(command, { stdio: 'inherit' });
      
      console.log(`✅ Successfully imported ${path.basename(forestShapefile)}`);
    } catch (error) {
      console.error(`❌ Failed to import ${forestShapefile}:`, error.message);
    }
  }

  console.log('\n✨ BD Forêt import complete!');
  
  // Show summary
  await showImportSummary();
}

function findShapefiles(directory: string): string[] {
  const shapefiles: string[] = [];
  
  function searchRecursive(dir: string) {
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

function buildOgr2ogrCommand(shapefile: string): string {
  const { host, port, database, username, password } = DB_CONFIG;
  
  // Connection string for PostgreSQL
  const pgConnection = `PG:host=${host} port=${port} dbname=${database} user=${username} password=${password}`;
  
  // ogr2ogr options:
  // -f "PostgreSQL" : output format
  // -append : add to existing table (or -overwrite for first run)
  // -t_srs EPSG:4326 : transform to WGS84
  // -nln forest_data : table name
  // -lco GEOMETRY_NAME=geometry : column name for geometry
  // -lco SPATIAL_INDEX=GIST : create spatial index
  
  return `ogr2ogr -f "PostgreSQL" "${pgConnection}" \
    "${shapefile}" \
    -nln forest_data \
    -append \
    -t_srs EPSG:4326 \
    -lco GEOMETRY_NAME=geometry \
    -lco SPATIAL_INDEX=GIST \
    -lco OVERWRITE=YES \
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

    const result = await dataSource.query(`
      SELECT COUNT(*) as count FROM forest_data;
    `);

    console.log(`\n📊 Import Summary:`);
    console.log(`   Total forest records: ${result[0].count}`);

    await dataSource.destroy();
  } catch (error) {
    console.warn('⚠️  Could not fetch summary:', error.message);
  }
}

// Run the import
importBDForet().catch(error => {
  console.error('❌ Import failed:', error);
  process.exit(1);
});