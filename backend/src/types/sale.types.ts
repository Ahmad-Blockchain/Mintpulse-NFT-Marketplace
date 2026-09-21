export interface Sale {

    id: number;

    listing_id: number;

    nft_id: number;

    seller: string;

    buyer: string;

    price: number;

    payment_token: string;

    marketplace_fee: number;

    royalty_fee: number;

    transaction_hash: string | null;

    created_at: Date;

}

export interface CreateSaleBody {

    transaction_hash?: string;

}