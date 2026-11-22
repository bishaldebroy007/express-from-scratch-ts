import express, { type Express, type Request, type Response } from "express";
import { Pool } from "pg";

const app: Express = express();
const port = 5000;

// middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true })); // to handle both urlencoded and nested data

// database connection
const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_A8FSiwzt6qhP@ep-blue-sound-aoh52u9u.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=false&channel_binding=require",
});

// DB query

const initDB = async () => {
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

initDB();

// GET Method route
app.get("/", (req: Request, res: Response) => {
  // res.send("Practice Again!");
  res.status(200).json({
    success: true,
    message: "Root route: GET Method route",
    author: "Bishal",
  });
});

// POST

app.post("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const { name, email, password, age } = req.body;

    // creating a connection with DB, so that data can be inserted

    const result = await pool.query(
      `
    INSERT INTO users (name, email, password, age) VALUES ($1, $2, $3, $4) RETURNING *
    `,
      [name, email, password, age],
    );

    res.status(201).json({
      success: true,
      message: "User Created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error instanceof Error ? error.message : "unknown error occured!",
    });
  }
});

// post: Get all users

app.get("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM users;
      `);
    // console.log(result.rows);
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    console.error("Error getting all users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error instanceof Error ? error.message : "unknown error occured!",
    });
  }
});

// get a single users info

app.get("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // or, req.params.id
    const result = await pool.query(
      `
      SELECT * FROM users WHERE id = $1;
      `,
      [id],
    );
    // console.log(result.rows);
    res.status(200).json({
      success: true,
      message: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.log("Error getting a single user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get the user",
      error: error instanceof Error ? error.message : "The error is unknown",
    });
  }
});

app.listen(port, () => {
  console.log(`App is listening at ${port}`);
});
