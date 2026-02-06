/* istanbul ignore file */
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Use test database when NODE_ENV is 'test'
const isTest = process.env.NODE_ENV === 'test';

const pool = new Pool({
  host: isTest ? process.env.PGHOST_TEST : process.env.PGHOST,
  port: isTest ? process.env.PGPORT_TEST : process.env.PGPORT,
  user: isTest ? process.env.PGUSER_TEST : process.env.PGUSER,
  password: isTest ? process.env.PGPASSWORD_TEST : process.env.PGPASSWORD,
  database: isTest ? process.env.PGDATABASE_TEST : process.env.PGDATABASE,
});

export default pool;