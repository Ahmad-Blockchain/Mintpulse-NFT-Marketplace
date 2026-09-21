// ==========================================================
// MintPulse NFT Event Listener
// ==========================================================
import { nftContract } from "../contracts/contracts.js";
import { EventService } from "../services/event.service.js";
import { BlockchainEventService } from "../services/blockchainEvent.service.js";
// ==========================================================
// Start NFT Events
// ==========================================================
export function startNFTEvents() {
    console.log("NFT Event Listener Started");
    // ======================================================
    // NFT Minted
    // ======================================================
    nftContract.on("NFTMinted", async (tokenId, creator, owner, metadataURI, event) => {
        const transactionHash = event.log.transactionHash;
        const logIndex = Number(event.log.index);
        try {
            const processed = await BlockchainEventService.isProcessed(transactionHash, logIndex);
            if (processed) {
                console.log(`[EVENT] NFTMinted duplicate skipped: ${transactionHash}:${logIndex}`);
                return;
            }
            const contractAddress = await nftContract.getAddress();
            console.log("");
            console.log("=================================");
            console.log("NFT Minted Event");
            console.log("=================================");
            console.log("Token ID :", tokenId.toString());
            console.log("Creator  :", creator);
            console.log("Owner    :", owner);
            console.log("Metadata :", metadataURI);
            console.log("TX Hash  :", transactionHash);
            console.log("Block    :", event.log.blockNumber);
            console.log("Log      :", logIndex);
            await EventService.handleNFTMinted(Number(tokenId), contractAddress, creator, owner, metadataURI, transactionHash);
            await BlockchainEventService.saveProcessedEvent("NFTMinted", transactionHash, Number(event.log.blockNumber), logIndex, contractAddress);
            console.log("NFT + Transaction saved to MySQL");
            console.log("");
        }
        catch (error) {
            console.error("NFTMinted Event Error:", error);
        }
    });
}
//# sourceMappingURL=nft.events.js.map