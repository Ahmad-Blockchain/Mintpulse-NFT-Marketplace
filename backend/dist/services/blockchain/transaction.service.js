// ==========================================================
// MintPulse Transaction Service
// ==========================================================
export class TransactionService {
    // ==========================================================
    // Wait For Transaction Confirmation
    // ==========================================================
    static async waitForConfirmation(tx) {
        const receipt = await tx.wait();
        if (!receipt) {
            throw new Error("Transaction receipt was not returned");
        }
        if (receipt.status !== 1) {
            throw new Error(`Blockchain transaction failed: ${receipt.hash}`);
        }
        return {
            hash: receipt.hash,
            blockNumber: receipt.blockNumber,
            status: receipt.status
        };
    }
    // ==========================================================
    // Get Transaction Hash
    // ==========================================================
    static getTransactionHash(tx) {
        return tx.hash;
    }
}
//# sourceMappingURL=transaction.service.js.map