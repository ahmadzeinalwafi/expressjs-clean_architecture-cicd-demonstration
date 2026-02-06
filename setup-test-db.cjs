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
    console.log('Setting up test database:', process.env.PGDATABASE_TEST);

    // Drop all tables first
    await pool.query('DROP TABLE IF EXISTS pgmigrations CASCADE');
    await pool.query('DROP TABLE IF EXISTS replies CASCADE');
    await pool.query('DROP TABLE IF EXISTS comments CASCADE');
    await pool.query('DROP TABLE IF EXISTS threads CASCADE');
    await pool.query('DROP TABLE IF EXISTS likes CASCADE');
    await pool.query('DROP TABLE IF EXISTS authentications CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    console.log('Dropped existing tables');

    // Create users table
    await pool.query(`
      CREATE TABLE users (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        fullname TEXT NOT NULL
      )
    `);
    console.log('Created users table');

    // Create authentications table
    await pool.query(`
      CREATE TABLE authentications (
        token TEXT NOT NULL
      )
    `);
    console.log('Created authentications table');

    // Create threads table
    await pool.query(`
      CREATE TABLE threads (
        id VARCHAR(50) PRIMARY KEY,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        owner VARCHAR(50) NOT NULL REFERENCES users ON DELETE CASCADE,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('Created threads table');

    // Create comments table
    await pool.query(`
      CREATE TABLE comments (
        id VARCHAR(50) PRIMARY KEY,
        content TEXT NOT NULL,
        owner VARCHAR(50) NOT NULL REFERENCES users ON DELETE CASCADE,
        thread_id VARCHAR(50) NOT NULL REFERENCES threads ON DELETE CASCADE,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        is_deleted BOOLEAN DEFAULT false NOT NULL
      )
    `);
    console.log('Created comments table');

    // Create replies table
    await pool.query(`
      CREATE TABLE replies (
        id VARCHAR(50) PRIMARY KEY,
        content TEXT NOT NULL,
        owner VARCHAR(50) NOT NULL REFERENCES users ON DELETE CASCADE,
        comment_id VARCHAR(50) NOT NULL REFERENCES comments ON DELETE CASCADE,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        is_deleted BOOLEAN DEFAULT false NOT NULL
      )
    `);
    console.log('Created replies table');

    // Create likes table
    await pool.query(`
      CREATE TABLE likes (
        id VARCHAR(50) PRIMARY KEY,
        owner VARCHAR(50) NOT NULL REFERENCES users ON DELETE CASCADE,
        comment_id VARCHAR(50) NOT NULL REFERENCES comments ON DELETE CASCADE,
        CONSTRAINT unique_owner_comment_id UNIQUE(owner, comment_id)
      )
    `);
    console.log('Created likes table');

    console.log('Test database setup complete!');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await pool.end();
  }
}

main();
