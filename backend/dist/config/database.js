import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
export async function connectDatabase() {
    try {
        const connection = await pool.getConnection();
        console.log("✅ MySQL Connected");
        connection.release();
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}
//# sourceMappingURL=database.js.map