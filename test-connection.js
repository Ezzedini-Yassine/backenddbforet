const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: 'postgres',
  database: 'forest_db',
});

console.log('Testing connection to localhost:5433...');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Failed:', err.message);
    console.error('Code:', err.code);
  } else {
    console.log('✅ Success!', res.rows[0]);
  }
  pool.end();
});