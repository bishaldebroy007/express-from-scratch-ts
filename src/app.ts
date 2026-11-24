import express, { type Express, type Request, type Response } from "express";
import { pool } from "./db";

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
		if (result.rowCount === 0) {
			res.status(404).json({
				success: false,
				message: "User Not Found!",
			});
		}
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
		if (result.rowCount === 0) {
			res.status(404).json({
				success: false,
				message: "User Not Found!",
			});
		}
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

// put method

app.put("/api/v1/users/:id", async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { name, password, is_active, age } = req.body;

		const result = await pool.query(
			`
        UPDATE users
        SET
        name = COALESCE($1, name),
        password = COALESCE($2, password),
        age = COALESCE($3, age),
        is_Active = COALESCE($4, is_Active),
        updated_at = NOW()

        WHERE id=$5 RETURNING *
      `,
			[name ?? null, password ?? null, age ?? null, is_active ?? null, id],
		);

		if (result.rowCount === 0) {
			res.status(404).json({
				success: false,
				message: "User Not Found!",
			});
		}

		res.status(200).json({
			sucess: true,
			message: "User info updated succesfully",
			data: result.rows[0],
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: error?.message,
			error: error,
		});
	}
});

// Delete
app.delete("/api/v1/users/:id", async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const result = await pool.query(
			`
			DELETE FROM users WHERE id=$1
			`,
			[id],
		);
		// console.log(result);
		if (result.rowCount === 0) {
			res.status(404).json({
				success: false,
				message: "User Not Found!",
			});
		}
		res.status(200).json({
			success: true,
			message: "User deleted successfully!",
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: error?.message,
			error: error,
		});
	}
});

export default app;
