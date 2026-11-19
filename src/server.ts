import express, { type Express, type Request, type Response } from "express";

const app: Express = express();
const port = 5000;

// middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true })); // to handle both urlencoded and nested data

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
  console.log(req.body);
});

app.listen(port, () => {
  console.log(`App is listening at ${port}`);
});
