// ==========================================================
// Collection Database Model
// ==========================================================

export interface Collection {

    id: number;

    contract_address: string;

    creator: string;

    name: string;

    slug: string;

    symbol: string | null;

    description: string | null;

    logo_image: string | null;

    banner_image: string | null;

    featured_image: string | null;

    website: string | null;

    discord: string | null;

    telegram: string | null;

    twitter: string | null;

    instagram: string | null;

    royalty: number;

    blockchain: string;

    verified: boolean;

    total_supply: number;

    floor_price: number | null;

    volume: number;

    owners: number;

    created_at: Date;

    updated_at: Date;

}

// ==========================================================
// Create Collection
// ==========================================================

export interface CreateCollectionBody {

    contract_address: string;

    creator: string;

    name: string;

    slug: string;

    symbol?: string;

    description?: string;

    logo_image?: string;

    banner_image?: string;

    featured_image?: string;

    website?: string;

    discord?: string;

    telegram?: string;

    twitter?: string;

    instagram?: string;

    royalty?: number;

    blockchain?: string;

}

// ==========================================================
// Update Collection
// ==========================================================

export interface UpdateCollectionBody {

    name?: string;

    description?: string;

    symbol?: string;

    logo_image?: string;

    banner_image?: string;

    featured_image?: string;

    website?: string;

    discord?: string;

    telegram?: string;

    twitter?: string;

    instagram?: string;

    royalty?: number;

}

// ==========================================================
// Collection Query
// ==========================================================

export interface CollectionQuery {

    page?: number;

    limit?: number;

    search?: string;

    verified?: boolean;

    creator?: string;

    blockchain?: string;

    sort?:
        | "created_at"
        | "volume"
        | "floor_price"
        | "owners"
        | "name";

    order?: "ASC" | "DESC";

}

// ==========================================================
// Route Params
// ==========================================================

export interface CollectionParams {

    id: string;

}

export interface CollectionSlugParams {

    slug: string;

}