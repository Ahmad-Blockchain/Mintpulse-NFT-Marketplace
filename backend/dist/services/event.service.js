// ==========================================================
// MintPulse Event Service
// ==========================================================
import { NFTService } from "./nft.service.js";
import { MarketplaceService } from "./marketplace.service.js";
import { TransactionService } from "./transaction.service.js";
export class EventService {
    // ======================================================
    // Handle NFT Minted Event
    // ======================================================
    static async handleNFTMinted(tokenId, contractAddress, creator, owner, metadataURI, transactionHash) {
        const normalizedContract = contractAddress.toLowerCase();
        const normalizedCreator = creator.toLowerCase();
        const normalizedOwner = owner.toLowerCase();
        await NFTService.createNFT({
            token_id: tokenId,
            contract_address: normalizedContract,
            creator: normalizedCreator,
            owner: normalizedOwner,
            metadata_uri: metadataURI,
            minted_tx_hash: transactionHash
        });
        await TransactionService.createTransaction({
            tx_hash: transactionHash,
            token_id: tokenId,
            buyer: null,
            seller: normalizedCreator,
            price: null,
            event_type: "NFT_MINTED"
        });
        console.log(`[EVENT] NFT ${tokenId} synced successfully`);
    }
    // ======================================================
    // Handle NFT Listed Event
    // ======================================================
    static async handleNFTListed(tokenId, contractAddress, seller, price, transactionHash) {
        const normalizedContract = contractAddress.toLowerCase();
        const normalizedSeller = seller.toLowerCase();
        await MarketplaceService.createListing(tokenId, normalizedContract, normalizedSeller, price, transactionHash);
        await TransactionService.createTransaction({
            tx_hash: transactionHash,
            token_id: tokenId,
            buyer: null,
            seller: normalizedSeller,
            price: price,
            event_type: "NFT_LISTED"
        });
        console.log(`[EVENT] Listing for NFT ${tokenId} synced successfully`);
    }
    // ======================================================
    // Handle NFT Sold Event
    // ======================================================
    static async handleNFTSold(tokenId, buyer, price, transactionHash) {
        const normalizedBuyer = buyer.toLowerCase();
        await MarketplaceService.markAsSold(tokenId, normalizedBuyer);
        await TransactionService.createTransaction({
            tx_hash: transactionHash,
            token_id: tokenId,
            buyer: normalizedBuyer,
            seller: null,
            price: price,
            event_type: "NFT_SOLD"
        });
        console.log(`[EVENT] NFT ${tokenId} sale synced successfully`);
    }
}
//# sourceMappingURL=event.service.js.map