import { pool } from "../config/database.js";
export class SyncStateService {
    // ==========================================================
    // Get Last Processed Block
    // ==========================================================
    static async getLastProcessedBlock(contractName) {
        const [rows] = await pool.execute(`
                SELECT last_block
                FROM sync_state
                WHERE contract_name = ?
                LIMIT 1
                `, [
            contractName
        ]);
        if (rows.length === 0) {
            return 0;
        }
        return Number(rows[0].last_block);
    }
    // ==========================================================
    // Update Last Processed Block
    // ==========================================================
    static async updateLastProcessedBlock(contractName, blockNumber) {
        await pool.execute(`
            INSERT INTO sync_state
            (
                contract_name,
                last_block
            )
            VALUES (?, ?)

            ON DUPLICATE KEY UPDATE
                last_block = VALUES(last_block)
            `, [
            contractName,
            blockNumber
        ]);
    }
}
//# sourceMappingURL=syncState.service.js.map