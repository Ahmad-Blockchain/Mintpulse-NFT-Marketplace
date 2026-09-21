
// ==========================================================
// Listing Database Model
// ==========================================================

export interface Listing {

    id: number;

    nft_id: number;

    seller: string;

    owner: string;

    listing_type:
        | "fixed"
        | "auction";

    price: number;

    payment_token: string;

    marketplace_fee: number;

    royalty_fee: number;

    status:
        | "active"
        | "sold"
        | "cancelled"
        | "expired";

    transaction_hash: string | null;

    expires_at: Date | null;

    listed_at: Date;

    updated_at: Date;

}


// ==========================================================
// Create Listing Request
// ==========================================================

export interface CreateListingBody {

    nft_id: number;

    price: number;

    payment_token: string;

    listing_type?:
        | "fixed"
        | "auction";

    expires_at?: string;

}


// ==========================================================
// Update Listing Request
// ==========================================================

export interface UpdateListingBody {

    price?: number;

    payment_token?: string;

    expires_at?: string | null;

}


// ==========================================================
// Listing Query Parameters
// ==========================================================

export interface ListingQuery {

    page?: number;

    limit?: number;

    seller?: string;

    owner?: string;

    listing_type?:
        | "fixed"
        | "auction";

    status?:
        | "active"
        | "sold"
        | "cancelled"
        | "expired";

    min_price?: number;

    max_price?: number;

    sort?:
        | "listed_at"
        | "price";

    order?:
        | "ASC"
        | "DESC";

}
