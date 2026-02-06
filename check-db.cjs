require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST_TEST,
  port: process.env.PGPORT_TEST,
  user: process.env.PGUSER_TEST,
  password: process.env.PGPASSWORD_TEST,
  database: process.env.PGDATABASE_TEST,
});

async function main() {
  try {
    console.log('Resetting test database:', process.env.PGDATABASE_TEST);
    await pool.query('DROP TABLE IF EXISTS pgmigrations CASCADE');
    await pool.query('DROP TABLE IF EXISTS replies CASCADE');
    await pool.query('DROP TABLE IF EXISTS comments CASCADE');
    await pool.query('DROP TABLE IF EXISTS threads CASCADE');
    await pool.query('DROP TABLE IF EXISTS authentications CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    console.log('All tables dropped. Ready for fresh migrations.');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await pool.end();
  }
}

main();
