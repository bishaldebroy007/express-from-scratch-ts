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
    "postgresql://neondb_owner:npg_A8FSiwzt6qhP@ep-blue-sound-aoh52u9u.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});
console.log(pool);
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
