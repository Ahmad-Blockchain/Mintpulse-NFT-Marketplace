// ==========================================================
// MintPulse Transaction Types
// ==========================================================

export interface Transaction {

    id: number;

    tx_hash: string;

    token_id: number | null;

    buyer: string | null;

    seller: string | null;

    /**
     * Stored as MySQL DECIMAL.
     * Kept as string to prevent blockchain precision loss.
     */
    price: string | null;

    event_type: string | null;

    created_at: Date;

}

// ==========================================================
// Create Transaction
// ==========================================================

export interface CreateTransactionBody {

    tx_hash: string;

    token_id?: number | null;

    buyer?: string | null;

    seller?: string | null;

    /**
     * DECIMAL(36,18)
     */
    price?: string | null;

    event_type?: string | null;

}

// ==========================================================
// Transaction Query
// ==========================================================

export interface TransactionQuery {

    page?: number;

    limit?: number;

    tx_hash?: string;

    token_id?: number;

    buyer?: string;

    seller?: string;

    event_type?: string;

    sort?:
        | "created_at"
        | "price"
        | "token_id";

    order?:
        | "ASC"
        | "DESC";

}