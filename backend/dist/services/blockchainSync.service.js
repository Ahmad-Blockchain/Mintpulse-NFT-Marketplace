// ==========================================================
// MintPulse Blockchain Sync Service
// ==========================================================
import { nftContract, marketplaceContract } from "../contracts/contracts.js";
import { SyncStateService } from "./syncState.service.js";
import { EventService } from "./event.service.js";
import { BlockchainEventService } from "./blockchainEvent.service.js";
import { EventLog } from "ethers";
// ==========================================================
// Blockchain Sync Service
// ==========================================================
export class BlockchainSyncService {
    // ======================================================
    // Sync NFT Mint Events
    // ======================================================
    static async syncNFTEvents() {
        try {
            console.log("");
            console.log("=================================");
            console.log("Syncing NFT Contract");
            console.log("=================================");
            // --------------------------------------------------
            // Provider
            // --------------------------------------------------
            const provider = nftContract.runner?.provider;
            if (!provider) {
                console.error("[SYNC] NFT provider is not connected.");
                return;
            }
            // --------------------------------------------------
            // Contract Address
            // --------------------------------------------------
            const contractAddress = (await nftContract.getAddress()).toLowerCase();
            // --------------------------------------------------
            // Blockchain State
            // --------------------------------------------------
            let lastBlock = await SyncStateService.getLastProcessedBlock("MintPulseNFT");
            const currentBlock = await provider.getBlockNumber();
            console.log("Last Block    :", lastBlock);
            console.log("Current Block :", currentBlock);
            // --------------------------------------------------
            // Detect Blockchain Rollback
            // --------------------------------------------------
            if (lastBlock > currentBlock) {
                console.warn("[SYNC] NFT blockchain rollback detected.");
                console.warn(`[SYNC] Stored block: ${lastBlock}`);
                console.warn(`[SYNC] Current block: ${currentBlock}`);
                await SyncStateService.updateLastProcessedBlock("MintPulseNFT", 0);
                lastBlock = 0;
                console.log("[SYNC] NFT sync state reset to block 0.");
            }
            // --------------------------------------------------
            // Already Synchronized
            // --------------------------------------------------
            if (lastBlock >= currentBlock) {
                console.log("NFT contract is already synchronized.");
                console.log("");
                return;
            }
            // --------------------------------------------------
            // Query Historical NFTMinted Events
            // --------------------------------------------------
            const events = await nftContract.queryFilter(nftContract.filters.NFTMinted(), lastBlock + 1, currentBlock);
            console.log("NFTMinted Events Found:", events.length);
            // --------------------------------------------------
            // Process Events
            // --------------------------------------------------
            for (const event of events) {
                if (!(event instanceof EventLog)) {
                    console.warn("[SYNC] Unknown NFT event skipped.");
                    continue;
                }
                const transactionHash = event.transactionHash;
                const logIndex = Number(event.index);
                // --------------------------------------------------
                // Duplicate Protection
                // --------------------------------------------------
                const processed = await BlockchainEventService.isProcessed(transactionHash, logIndex);
                if (processed) {
                    console.log(`[SYNC] NFTMinted duplicate skipped: ${transactionHash}:${logIndex}`);
                    continue;
                }
                try {
                    const args = event.args;
                    // --------------------------------------------------
                    // Event Processing
                    // --------------------------------------------------
                    await EventService.handleNFTMinted(Number(args.tokenId), contractAddress, String(args.creator), String(args.owner), String(args.tokenURI), transactionHash);
                    // --------------------------------------------------
                    // Mark Event As Processed
                    // --------------------------------------------------
                    await BlockchainEventService.saveProcessedEvent("NFTMinted", transactionHash, Number(event.blockNumber), logIndex, contractAddress);
                    console.log(`[SYNC] NFTMinted processed: ${transactionHash}:${logIndex}`);
                }
                catch (error) {
                    console.error(`[SYNC] NFTMinted processing failed: ${transactionHash}:${logIndex}`, error);
                    /*
                     * Do not stop the complete synchronization.
                     *
                     * The event is NOT marked as processed.
                     * It can therefore be retried on the next sync.
                     */
                }
            }
            // --------------------------------------------------
            // Update Sync State
            // --------------------------------------------------
            await SyncStateService.updateLastProcessedBlock("MintPulseNFT", currentBlock);
            console.log("NFT synchronization completed.");
            console.log("");
        }
        catch (error) {
            console.error("NFT Sync Error:", error);
        }
    }
    // ======================================================
    // Sync Marketplace Events
    // ======================================================
    static async syncMarketplaceEvents() {
        try {
            console.log("");
            console.log("=================================");
            console.log("Syncing Marketplace");
            console.log("=================================");
            // --------------------------------------------------
            // Provider
            // --------------------------------------------------
            const provider = marketplaceContract.runner?.provider;
            if (!provider) {
                console.error("[SYNC] Marketplace provider is not connected.");
                return;
            }
            // --------------------------------------------------
            // Contract Address
            // --------------------------------------------------
            const marketplaceAddress = (await marketplaceContract.getAddress()).toLowerCase();
            // --------------------------------------------------
            // Blockchain State
            // --------------------------------------------------
            let lastBlock = await SyncStateService.getLastProcessedBlock("MintPulseMarketplace");
            const currentBlock = await provider.getBlockNumber();
            console.log("Last Block    :", lastBlock);
            console.log("Current Block :", currentBlock);
            // --------------------------------------------------
            // Detect Blockchain Rollback
            // --------------------------------------------------
            if (lastBlock > currentBlock) {
                console.warn("[SYNC] Marketplace blockchain rollback detected.");
                console.warn(`[SYNC] Stored block: ${lastBlock}`);
                console.warn(`[SYNC] Current block: ${currentBlock}`);
                await SyncStateService.updateLastProcessedBlock("MintPulseMarketplace", 0);
                lastBlock = 0;
                console.log("[SYNC] Marketplace sync state reset to block 0.");
            }
            // --------------------------------------------------
            // Already Synchronized
            // --------------------------------------------------
            if (lastBlock >= currentBlock) {
                console.log("Marketplace is already synchronized.");
                console.log("");
                return;
            }
            // ==================================================
            // NFT Listed Events
            // ==================================================
            const listedEvents = await marketplaceContract.queryFilter(marketplaceContract.filters.NFTListed(), lastBlock + 1, currentBlock);
            console.log("NFTListed Events Found:", listedEvents.length);
            for (const event of listedEvents) {
                if (!(event instanceof EventLog)) {
                    console.warn("[SYNC] Unknown NFTListed event skipped.");
                    continue;
                }
                const transactionHash = event.transactionHash;
                const logIndex = Number(event.index);
                // --------------------------------------------------
                // Duplicate Protection
                // --------------------------------------------------
                const processed = await BlockchainEventService.isProcessed(transactionHash, logIndex);
                if (processed) {
                    console.log(`[SYNC] NFTListed duplicate skipped: ${transactionHash}:${logIndex}`);
                    continue;
                }
                try {
                    const args = event.args;
                    const price = args.price.toString();
                    // --------------------------------------------------
                    // Event Processing
                    // --------------------------------------------------
                    await EventService.handleNFTListed(Number(args.tokenId), String(args.nftContract), String(args.seller), price, transactionHash);
                    // --------------------------------------------------
                    // Mark Event As Processed
                    // --------------------------------------------------
                    await BlockchainEventService.saveProcessedEvent("NFTListed", transactionHash, Number(event.blockNumber), logIndex, marketplaceAddress);
                    console.log(`[SYNC] NFTListed processed: ${transactionHash}:${logIndex}`);
                }
                catch (error) {
                    console.error(`[SYNC] NFTListed processing failed: ${transactionHash}:${logIndex}`, error);
                }
            }
            // ==================================================
            // NFT Sold Events
            // ==================================================
            const soldEvents = await marketplaceContract.queryFilter(marketplaceContract.filters.NFTSold(), lastBlock + 1, currentBlock);
            console.log("NFTSold Events Found:", soldEvents.length);
            for (const event of soldEvents) {
                if (!(event instanceof EventLog)) {
                    console.warn("[SYNC] Unknown NFTSold event skipped.");
                    continue;
                }
                const transactionHash = event.transactionHash;
                const logIndex = Number(event.index);
                // --------------------------------------------------
                // Duplicate Protection
                // --------------------------------------------------
                const processed = await BlockchainEventService.isProcessed(transactionHash, logIndex);
                if (processed) {
                    console.log(`[SYNC] NFTSold duplicate skipped: ${transactionHash}:${logIndex}`);
                    continue;
                }
                try {
                    const args = event.args;
                    const price = args.price.toString();
                    // --------------------------------------------------
                    // Event Processing
                    // --------------------------------------------------
                    await EventService.handleNFTSold(Number(args.tokenId), String(args.buyer), price, transactionHash);
                    // --------------------------------------------------
                    // Mark Event As Processed
                    // --------------------------------------------------
                    await BlockchainEventService.saveProcessedEvent("NFTSold", transactionHash, Number(event.blockNumber), logIndex, marketplaceAddress);
                    console.log(`[SYNC] NFTSold processed: ${transactionHash}:${logIndex}`);
                }
                catch (error) {
                    console.error(`[SYNC] NFTSold processing failed: ${transactionHash}:${logIndex}`, error);
                }
            }
            // --------------------------------------------------
            // Update Marketplace Sync State
            // --------------------------------------------------
            await SyncStateService.updateLastProcessedBlock("MintPulseMarketplace", currentBlock);
            console.log("Marketplace synchronization completed.");
            console.log("");
        }
        catch (error) {
            console.error("Marketplace Sync Error:", error);
        }
    }
    // ======================================================
    // Sync All Blockchain Events
    // ======================================================
    static async syncAll() {
        await this.syncNFTEvents();
        await this.syncMarketplaceEvents();
    }
}
//# sourceMappingURL=blockchainSync.service.js.map