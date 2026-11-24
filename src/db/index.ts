import { Pool } from "pg";
import config from "../config";

// database connection
export const pool = new Pool({
	connectionString: config.connection_string,
});

// DB query
export const initDB = async () => {
	try {
		await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      age INT NOT NULL,

      is_Active BOOLEAN DEFAULT true,

      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      );
      `);
		console.log("Database initialized successfully");
	} catch (error) {
		console.error("Error initializing database:", error);
	}
};
