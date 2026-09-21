import { pool } from "../config/database.js";
export class BlockchainEventService {
    // ==========================================================
    // Check Whether Event Was Already Processed
    // ==========================================================
    static async isProcessed(txHash, logIndex) {
        const [rows] = await pool.execute(`
                SELECT id
                FROM blockchain_events
                WHERE transaction_hash = ?
                  AND log_index = ?
                LIMIT 1
                `, [
            txHash,
            logIndex
        ]);
        return rows.length > 0;
    }
    // ==========================================================
    // Save Blockchain Event
    // ==========================================================
    static async save(eventName, txHash, blockNumber, logIndex, contractAddress) {
        await pool.execute(`
            INSERT INTO blockchain_events
            (
                transaction_hash,
                block_number,
                log_index,
                event_name,
                contract_address
            )
            VALUES (?, ?, ?, ?, ?)
            `, [
            txHash,
            blockNumber,
            logIndex,
            eventName,
            contractAddress
        ]);
    }
    // ==========================================================
    // Save Processed Event
    // ==========================================================
    static async saveProcessedEvent(eventName, txHash, blockNumber, logIndex, contractAddress) {
        await this.save(eventName, txHash, blockNumber, logIndex, contractAddress);
    }
}
//# sourceMappingURL=blockchainEvent.service.js.map