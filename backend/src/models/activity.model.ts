export interface Activity {
    id: string;
    event: "Minted" | "Listed" | "ListingUpdated" | "ListingCancelled" | "Bought" | "OfferCreated" | "OfferAccepted" | "AuctionCreated" | "BidPlaced";
    nftContract: string;
    tokenId: string;
    fromAddress?: string;
    toAddress?: string;
    price?: string;
    transactionHash: string;
    createdAt: Date;
}
