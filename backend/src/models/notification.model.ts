export interface Notification {
    id: string;
    walletAddress: string;
    title: string;
    message: string;
    type: "SOLD" | "BOUGHT" | "OFFER_RECEIVED" | "OFFER_ACCEPTED" | "OUTBID" | "AUCTION_WON";
    read: boolean;
    createdAt: Date;
}
