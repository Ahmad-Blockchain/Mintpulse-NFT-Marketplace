// ==========================================================
// MintPulse Transaction Service
// ==========================================================

import type {
    TransactionReceipt,
    TransactionResponse
} from "ethers";

export interface TransactionResult {
    hash: string;
    blockNumber: number;
    status: number;
}

export class TransactionService {

    // ==========================================================
    // Wait For Transaction Confirmation
    // ==========================================================

    static async waitForConfirmation(
        tx: TransactionResponse
    ): Promise<TransactionResult> {

        const receipt: TransactionReceipt | null =
            await tx.wait();

        if (!receipt) {

            throw new Error(
                "Transaction receipt was not returned"
            );

        }

        if (receipt.status !== 1) {

            throw new Error(
                `Blockchain transaction failed: ${receipt.hash}`
            );

        }

        return {

            hash: receipt.hash,

            blockNumber:
                receipt.blockNumber,

            status:
                receipt.status

        };
    }

    // ==========================================================
    // Get Transaction Hash
    // ==========================================================

    static getTransactionHash(
        tx: TransactionResponse
    ): string {

        return tx.hash;
    }
}