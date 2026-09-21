// ==========================================================
// MintPulse Admin Types
// ==========================================================

import type {
    Collection
} from "./collection.types.js";

// ==========================================================
// Admin Collection Query
// ==========================================================

export interface AdminCollectionQuery {

    page?: number;

    limit?: number;

    search?: string;

    creator?: string;

    blockchain?: string;

    verified?: boolean;

    sort?:
        | "created_at"
        | "volume"
        | "floor_price"
        | "owners"
        | "name";

    order?:
        | "ASC"
        | "DESC";

}

// ==========================================================
// Admin Collection
// ==========================================================

export type AdminCollection = Collection;

// ==========================================================
// Admin Collection Result
// ==========================================================

export interface AdminCollectionsResult {

    collections: AdminCollection[];

    pagination: {

        page: number;

        limit: number;

        total: number;

        totalPages: number;

    };

}