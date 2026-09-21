// ==========================================================
// MintPulse Marketplace Blockchain Service
// ==========================================================

import { marketplaceContract } from "../../contracts/contracts.js";
import { TransactionService } from "./transaction.service.js";

export interface MarketplaceTransactionResult {
    hash: string;
    blockNumber: number;
}

// ==========================================================
// Marketplace Blockchain Service
// ==========================================================

export class MarketplaceBlockchainService {

    // ==========================================================
    // List NFT
    // ==========================================================

    static async listNFT(
        nftAddress: string,
        tokenId: number,
        price: bigint
    ): Promise<MarketplaceTransactionResult> {

        // ------------------------------------------------------
        // Contract Configuration Check
        // ------------------------------------------------------

        if (!marketplaceContract) {

            throw new Error(
                "MintPulse Marketplace contract is not configured"
            );

        }

        // ------------------------------------------------------
        // Input Validation
        // ------------------------------------------------------

        if (!nftAddress) {

            throw new Error(
                "NFT contract address is required"
            );

        }

        if (!Number.isInteger(tokenId) || tokenId < 0) {

            throw new Error(
                "Invalid NFT token ID"
            );

        }

        if (price <= 0n) {

            throw new Error(
                "Listing price must be greater than zero"
            );

        }

        // ------------------------------------------------------
        // Send Blockchain Transaction
        // ------------------------------------------------------

        const tx =
            await marketplaceContract.listNFT(
                nftAddress,
                tokenId,
                price
            );

        // ------------------------------------------------------
        // Wait For Confirmation
        // ------------------------------------------------------

        const result =
            await TransactionService.waitForConfirmation(
                tx
            );

        // ------------------------------------------------------
        // Return Result
        // ------------------------------------------------------

        return {

            hash:
                result.hash,

            blockNumber:
                result.blockNumber

        };
    }
}