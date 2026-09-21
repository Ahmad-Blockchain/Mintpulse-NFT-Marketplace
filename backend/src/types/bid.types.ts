// ==========================================================
// MintPulse Bid Types
// ==========================================================

export interface Bid {
    id: number;

    auction_id: number;

    bidder: string;

    amount: number;

    transaction_hash: string | null;

    block_number: number | null;

    created_at: Date;
}

// ==========================================================
// Create Bid
// ==========================================================

export interface CreateBidBody {
    auction_id: number;

    amount: number;

    transaction_hash?: string | null;

    block_number?: number | null;
}

// ==========================================================
// Bid Query
// ==========================================================

export interface BidQuery {
    auction_id?: number;

    bidder?: string;

    min_amount?: number;

    max_amount?: number;

    page?: number;

    limit?: number;

    order?: "ASC" | "DESC";
}