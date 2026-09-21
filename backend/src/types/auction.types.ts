// ==========================================================
// MintPulse Auction Types
// ==========================================================

export type AuctionStatus =
    | "scheduled"
    | "active"
    | "ended"
    | "cancelled";

export interface Auction {

    id: number;

    nft_id: number;

    seller: string;

    start_price: number;

    reserve_price: number | null;

    buy_now_price: number | null;

    payment_token: string;

    highest_bid: number;

    highest_bidder: string | null;

    start_time: Date;

    end_time: Date;

    status: AuctionStatus;

    transaction_hash: string | null;

    created_at: Date;

    updated_at: Date;
}

// ==========================================================
// Create Auction
// ==========================================================

export interface CreateAuctionBody {

    nft_id: number;

    start_price: number;

    reserve_price?: number | null;

    buy_now_price?: number | null;

    payment_token: string;

    start_time: string;

    end_time: string;
}

// ==========================================================
// Update Auction
// ==========================================================

export interface UpdateAuctionBody {

    reserve_price?: number | null;

    buy_now_price?: number | null;

    start_time?: string;

    end_time?: string;
}

// ==========================================================
// Auction Query
// ==========================================================

export interface AuctionQuery {

    page?: number;

    limit?: number;

    seller?: string;

    nft_id?: number;

    status?: AuctionStatus;

    payment_token?: string;

    sort?:
        | "start_price"
        | "highest_bid"
        | "start_time"
        | "end_time"
        | "created_at";

    order?: "ASC" | "DESC";
}