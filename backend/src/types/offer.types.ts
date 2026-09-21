// ==========================================================
// Offer Types
// ==========================================================

export type OfferStatus =
    | "active"
    | "accepted"
    | "cancelled"
    | "expired"
    | "rejected";


// ==========================================================
// Offer Database Model
// ==========================================================

export interface Offer {

    id: number;

    nft_id: number;

    buyer: string;

    offered_price: number;

    payment_token: string;

    status: OfferStatus;

    transaction_hash: string | null;

    expires_at: Date | null;

    created_at: Date;

    updated_at: Date;

}


// ==========================================================
// Create Offer Body
// ==========================================================

export interface CreateOfferBody {

    nft_id: number;

    offered_price: number;

    payment_token: string;

    expires_at?: string | null;

}


// ==========================================================
// Update Offer Body
// ==========================================================

export interface UpdateOfferBody {

    offered_price?: number;

    payment_token?: string;

    expires_at?: string | null;

}


// ==========================================================
// Offer Query
// ==========================================================

export interface OfferQuery {

    page?: number;

    limit?: number;

    nft_id?: number;

    buyer?: string;

    status?: OfferStatus;

    min_price?: number;

    max_price?: number;

    sort?:
        | "offered_price"
        | "created_at"
        | "expires_at";

    order?: "ASC" | "DESC";

}


// ==========================================================
// Offer Route Parameters
// ==========================================================

export interface OfferParams {

    id: string;

}


// ==========================================================
// NFT Offer Route Parameters
// ==========================================================

export interface NFTOfferParams {

    nftId: string;

}