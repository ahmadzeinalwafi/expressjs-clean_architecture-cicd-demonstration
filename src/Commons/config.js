/* istanbul ignore file */
import dotenv from 'dotenv';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

const config = {
  app: {
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    port: process.env.PORT,
    debug: process.env.NODE_ENV === 'development' ? { request: ['error'] } : {},
  },
  database: {
    host: isTest ? process.env.PGHOST_TEST : process.env.PGHOST,
    port: isTest ? process.env.PGPORT_TEST : process.env.PGPORT,
    user: isTest ? process.env.PGUSER_TEST : process.env.PGUSER,
    password: isTest ? process.env.PGPASSWORD_TEST : process.env.PGPASSWORD,
    database: isTest ? process.env.PGDATABASE_TEST : process.env.PGDATABASE,
  },
  auth: {
    jwtStrategy: 'forumapi',
    accessTokenKey: process.env.ACCESS_TOKEN_KEY,
    refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
    accessTokenAge: process.env.ACCESS_TOKEN_AGE,
  },
};

export default config;