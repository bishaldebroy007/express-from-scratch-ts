import type { Request, Response } from "express";
import { pool } from "../../db";

const createUser = async (req: Request, res: Response) => {
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
};

// Creating an object, so that we can send as much functions as possible
export const userController = {
	createUser,
};
