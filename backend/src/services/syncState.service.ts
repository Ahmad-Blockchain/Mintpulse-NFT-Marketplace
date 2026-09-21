import {
    ResultSetHeader,
    RowDataPacket
} from "mysql2";

import { pool } from "../config/database.js";

interface SyncStateRow extends RowDataPacket {
    last_block: number;
}

export class SyncStateService {

    // ==========================================================
    // Get Last Processed Block
    // ==========================================================

    static async getLastProcessedBlock(
        contractName: string
    ): Promise<number> {

        const [rows] =
            await pool.execute<SyncStateRow[]>(
                `
                SELECT last_block
                FROM sync_state
                WHERE contract_name = ?
                LIMIT 1
                `,
                [
                    contractName
                ]
            );

        if (rows.length === 0) {
            return 0;
        }

        return Number(rows[0].last_block);
    }

    // ==========================================================
    // Update Last Processed Block
    // ==========================================================

    static async updateLastProcessedBlock(
        contractName: string,
        blockNumber: number
    ): Promise<void> {

        await pool.execute<ResultSetHeader>(
            `
            INSERT INTO sync_state
            (
                contract_name,
                last_block
            )
            VALUES (?, ?)

            ON DUPLICATE KEY UPDATE
                last_block = VALUES(last_block)
            `,
            [
                contractName,
                blockNumber
            ]
        );
    }
}