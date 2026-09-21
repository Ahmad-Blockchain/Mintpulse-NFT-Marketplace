import {
    ResultSetHeader,
    RowDataPacket
} from "mysql2";

import { pool } from "../config/database.js";

interface BlockchainEventRow extends RowDataPacket {
    id: number;
}

export class BlockchainEventService {

    // ==========================================================
    // Check Whether Event Was Already Processed
    // ==========================================================

    static async isProcessed(
        txHash: string,
        logIndex: number
    ): Promise<boolean> {

        const [rows] =
            await pool.execute<BlockchainEventRow[]>(
                `
                SELECT id
                FROM blockchain_events
                WHERE transaction_hash = ?
                  AND log_index = ?
                LIMIT 1
                `,
                [
                    txHash,
                    logIndex
                ]
            );

        return rows.length > 0;
    }

    // ==========================================================
    // Save Blockchain Event
    // ==========================================================

    static async save(
        eventName: string,
        txHash: string,
        blockNumber: number,
        logIndex: number,
        contractAddress: string
    ): Promise<void> {

        await pool.execute<ResultSetHeader>(
            `
            INSERT INTO blockchain_events
            (
                transaction_hash,
                block_number,
                log_index,
                event_name,
                contract_address
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                txHash,
                blockNumber,
                logIndex,
                eventName,
                contractAddress
            ]
        );
    }

    // ==========================================================
    // Save Processed Event
    // ==========================================================

    static async saveProcessedEvent(
        eventName: string,
        txHash: string,
        blockNumber: number,
        logIndex: number,
        contractAddress: string
    ): Promise<void> {

        await this.save(
            eventName,
            txHash,
            blockNumber,
            logIndex,
            contractAddress
        );
    }
}