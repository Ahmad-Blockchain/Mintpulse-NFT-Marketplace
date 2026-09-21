import { pool } from "../config/database.js";
export class AdminService {
    // ======================================================
    // Get Users
    // ======================================================
    static async getUsers(query) {
        const page = Math.max(Number(query.page ?? 1), 1);
        const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
        const offset = (page - 1) * limit;
        const values = [];
        let whereClause = "";
        // ==================================================
        // Search
        // ==================================================
        if (query.search?.trim()) {
            whereClause = `
                WHERE
                    wallet_address LIKE ?
                    OR username LIKE ?
            `;
            const search = `%${query.search.trim()}%`;
            values.push(search, search);
        }
        // ==================================================
        // Count
        // ==================================================
        const [countRows] = await pool.execute(`
                SELECT COUNT(*) AS total
                FROM users
                ${whereClause}
                `, values);
        const total = Number(countRows[0]?.total ?? 0);
        const totalPages = total === 0
            ? 0
            : Math.ceil(total / limit);
        // ==================================================
        // Users
        // ==================================================
        const [rows] = await pool.execute(`
                SELECT
                    id,
                    wallet_address,
                    username,
                    profile_Image,
                    bio,
                    nonce,
                    created_at,
                    updated_at
                FROM users
                ${whereClause}
                ORDER BY created_at DESC
                LIMIT ?
                OFFSET ?
                `, [
            ...values,
            limit,
            offset
        ]);
        return {
            users: rows,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        };
    }
    // ======================================================
    // Get User By Wallet
    // ======================================================
    static async getUserByWallet(wallet) {
        const [rows] = await pool.execute(`
                SELECT
                    id,
                    wallet_address,
                    username,
                    profile_Image,
                    bio,
                    nonce,
                    created_at,
                    updated_at
                FROM users
                WHERE wallet_address = ?
                LIMIT 1
                `, [wallet]);
        if (!rows.length) {
            return null;
        }
        return rows[0];
    }
}
//# sourceMappingURL=admin.service.js.map