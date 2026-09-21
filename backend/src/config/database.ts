import mysql from "mysql2/promise";
import { config } from "./env.js";

export const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "mintpulse",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export async function connectDatabase(): Promise<void> {
    try {
        const connection = await pool.getConnection();
        console.log("[DB] MySQL database connected successfully.");
        connection.release();
    } catch (error) {
        console.warn("[DB] MySQL database connection fallback (running standalone mode).");
    }
}