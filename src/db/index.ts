import pg from "pg";

import { config } from "../config/index.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.database_url,
});

export const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'contributor',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS issues (
      id SERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      type VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'open',
      reporter_id INTEGER NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  console.log("Database connected and tables initialized!");
};
