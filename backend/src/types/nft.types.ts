// ==========================================================
// NFT Database Model
// ==========================================================

export interface NFT {

    id: number;

    token_id: number;

    contract_address: string;

    creator: string;

    owner: string;

    collection_id: number | null;

    metadata_uri: string;

    image_url: string | null;

    animation_url: string | null;

    external_url: string | null;

    name: string | null;

    description: string | null;

    attributes: string | null;

    blockchain: string;

    royalty: number;

    is_burned: boolean;

    minted_tx_hash: string | null;

    minted_block: number | null;

    minted_at: Date;

    updated_at: Date;

}

// ==========================================================
// NFT Query Parameters
// ==========================================================

export interface NFTQuery {

    page?: number;

    limit?: number;

    search?: string;

    creator?: string;

    owner?: string;

    collection?: number;

    sort?:

        | "minted_at"
        | "name"
        | "royalty";

    order?:

        | "ASC"
        | "DESC";

}

// ==========================================================
// Route Params
// ==========================================================

export interface NFTParams {

    tokenId: string;

}