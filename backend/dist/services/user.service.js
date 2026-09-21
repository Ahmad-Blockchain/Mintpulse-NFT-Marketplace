import { pool } from "../config/database.js";
export class UserService {
    // ==========================================================
    // Create User
    // ==========================================================
    static async createUser(wallet, username, profile_Image, bio) {
        const [result] = await pool.execute(`
            INSERT INTO users
            (
                wallet_address,
                username,
                profile_Image,
                bio
            )
            VALUES (?, ?, ?, ?)
            `, [
            wallet,
            username,
            profile_Image,
            bio
        ]);
        return result.insertId;
    }
    // ==========================================================
    // Get All Users
    // ==========================================================
    static async getUsers() {
        const [rows] = await pool.execute(`
            SELECT *
            FROM users
            ORDER BY created_at DESC
            `);
        return rows;
    }
    // ==========================================================
    // Get User By Wallet
    // ==========================================================
    static async getUserByWallet(wallet) {
        const [rows] = await pool.execute(`
            SELECT *
            FROM users
            WHERE wallet_address = ?
            LIMIT 1
            `, [wallet]);
        return rows[0] ?? null;
    }
    // ==========================================================
    // Update User
    // ==========================================================
    static async updateUser(wallet, username, profile_Image, bio) {
        await pool.execute(`
            UPDATE users
            SET

                username=?,

                profile_Image=?,

                bio=?

            WHERE wallet_address=?
            `, [
            username,
            profile_Image,
            bio,
            wallet
        ]);
    }
    // ==========================================================
    // // Update User Nonce
    // // ==========================================================
    static async updateNonce(wallet, nonce) {
        await pool.execute(`
            UPDATE users
            SET nonce = ?
            WHERE wallet_address = ?
            `, [
            nonce,
            wallet
        ]);
    }
    // ==========================================================
    // Get User Nonce
    // ==========================================================
    static async getNonce(wallet) {
        const [rows] = await pool.execute(`
            SELECT nonce
            FROM users
            WHERE wallet_address = ?
            LIMIT 1
            `, [
            wallet
        ]);
        return rows[0]?.nonce ?? null;
    }
    // ==========================================================
    // Delete User
    // ==========================================================
    static async deleteUser(wallet) {
        await pool.execute(`
            DELETE FROM users
            WHERE wallet_address=?
            `, [wallet]);
    }
}
//# sourceMappingURL=user.service.js.map