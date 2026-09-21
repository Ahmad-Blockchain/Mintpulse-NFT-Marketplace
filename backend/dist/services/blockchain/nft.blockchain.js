// ==========================================================
// MintPulse NFT Blockchain Service
// ==========================================================
import { nftContract } from "../../contracts/contracts.js";
import { TransactionService } from "./transaction.service.js";
// ==========================================================
// NFT Blockchain Service
// ==========================================================
export class NFTBlockchainService {
    // ==========================================================
    // Mint NFT
    // ==========================================================
    static async mintNFT(to, metadataURI) {
        // ------------------------------------------------------
        // Contract Configuration Check
        // ------------------------------------------------------
        if (!nftContract) {
            throw new Error("MintPulse NFT contract is not configured");
        }
        // ------------------------------------------------------
        // Input Validation
        // ------------------------------------------------------
        if (!to) {
            throw new Error("NFT recipient address is required");
        }
        if (!metadataURI.trim()) {
            throw new Error("NFT metadata URI is required");
        }
        // ------------------------------------------------------
        // Send Blockchain Transaction
        // ------------------------------------------------------
        const tx = await nftContract.mintNFT(to, metadataURI);
        // ------------------------------------------------------
        // Wait For Confirmation
        // ------------------------------------------------------
        const result = await TransactionService.waitForConfirmation(tx);
        // ------------------------------------------------------
        // Return Result
        // ------------------------------------------------------
        return {
            hash: result.hash,
            blockNumber: result.blockNumber
        };
    }
}
//# sourceMappingURL=nft.blockchain.js.map