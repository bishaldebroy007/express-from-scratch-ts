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
      CREATE TABLE IF NOT EXISTS users2(
      id SERIAL PRIMARY KEY,
      NAME VARCHAR(255),
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,

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

app.post("/", async (req: Request, res: Response) => {
  const { name, age, password } = req.body;

  res.status(200).json({
    success: true,
    message: "Root route: POST Method route",
    data: { name, age },
  });
});

app.listen(port, () => {
  console.log(`App is listening at ${port}`);
});
