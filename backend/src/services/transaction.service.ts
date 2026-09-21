// ==========================================================
// MintPulse Transaction Service
// ==========================================================

import type {
    ResultSetHeader,
    RowDataPacket
} from "mysql2";

import { pool } from "../config/database.js";

import type {
    Transaction,
    TransactionQuery,
    CreateTransactionBody
} from "../types/transaction.types.js";


// ==========================================================
// Constants
// ==========================================================

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;


// ==========================================================
// Helpers
// ==========================================================

function normalizeTransactionHash(
    value: string
): string {

    const hash = value.trim();

    if (!/^0x[a-fA-F0-9]{64}$/.test(hash)) {

        throw new Error(
            "Invalid transaction hash"
        );

    }

    return hash.toLowerCase();

}


function normalizeAddress(
    value: string | null | undefined
): string | null {

    if (
        value === null ||
        value === undefined
    ) {

        return null;

    }

    const address =
        value.trim();

    if (!address) {

        return null;

    }

    if (
        !/^0x[a-fA-F0-9]{40}$/.test(address)
    ) {

        throw new Error(
            "Invalid Ethereum address"
        );

    }

    return address.toLowerCase();

}


function normalizeTokenId(
    value: number | null | undefined
): number | null {

    if (
        value === null ||
        value === undefined
    ) {

        return null;

    }

    if (
        !Number.isSafeInteger(value) ||
        value < 0
    ) {

        throw new Error(
            "Invalid token ID"
        );

    }

    return value;

}


function normalizePrice(
    value: string | number | null | undefined
): string | null {

    if (
        value === null ||
        value === undefined
    ) {

        return null;

    }

    const numValue = typeof value === "string" ? parseFloat(value) : value;

    if (!Number.isFinite(numValue)) {

        throw new Error(
            "Invalid transaction price"
        );

    }

    if (numValue < 0) {

        throw new Error(
            "Transaction price cannot be negative"
        );

    }

    return typeof value === "string" ? value : value.toString();

}


function normalizeEventType(
    value: string | null | undefined
): string | null {

    if (
        value === null ||
        value === undefined
    ) {

        return null;

    }

    const eventType =
        value.trim();

    if (!eventType) {

        return null;

    }

    if (eventType.length > 50) {

        throw new Error(
            "Event type cannot exceed 50 characters"
        );

    }

    return eventType;

}


// ==========================================================
// Service
// ==========================================================

export class TransactionService {


    // ======================================================
    // Create / Upsert Transaction
    // ======================================================

    static async createTransaction(
        data: CreateTransactionBody
    ): Promise<Transaction> {

        const txHash =
            normalizeTransactionHash(
                data.tx_hash
            );

        const tokenId =
            normalizeTokenId(
                data.token_id
            );

        const buyer =
            normalizeAddress(
                data.buyer
            );

        const seller =
            normalizeAddress(
                data.seller
            );

        const price =
            normalizePrice(
                data.price
            );

        const eventType =
            normalizeEventType(
                data.event_type
            );


        await pool.execute<ResultSetHeader>(

            `
            INSERT INTO transactions
            (
                tx_hash,
                token_id,
                buyer,
                seller,
                price,
                event_type
            )
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                token_id = COALESCE(
                    VALUES(token_id),
                    token_id
                ),
                buyer = COALESCE(
                    VALUES(buyer),
                    buyer
                ),
                seller = COALESCE(
                    VALUES(seller),
                    seller
                ),
                price = COALESCE(
                    VALUES(price),
                    price
                ),
                event_type = COALESCE(
                    VALUES(event_type),
                    event_type
                )
            `,

            [
                txHash,
                tokenId,
                buyer,
                seller,
                price,
                eventType
            ]

        );


        const transaction =
            await this.getTransactionByHash(
                txHash
            );


        if (!transaction) {

            throw new Error(
                "Transaction could not be retrieved after insertion"
            );

        }


        return transaction;

    }


    // ======================================================
    // Get Transaction By ID
    // ======================================================

    static async getTransactionById(
        id: number
    ): Promise<Transaction | null> {

        if (
            !Number.isSafeInteger(id) ||
            id <= 0
        ) {

            throw new Error(
                "Invalid transaction ID"
            );

        }


        const [rows] =
            await pool.execute<RowDataPacket[]>(

                `
                SELECT
                    id,
                    tx_hash,
                    token_id,
                    buyer,
                    seller,
                    price,
                    event_type,
                    created_at
                FROM transactions
                WHERE id = ?
                LIMIT 1
                `,

                [id]

            );


        return rows.length
            ? rows[0] as Transaction
            : null;

    }


    // ======================================================
    // Get Transaction By Hash
    // ======================================================

    static async getTransactionByHash(
        txHash: string
    ): Promise<Transaction | null> {

        const normalizedHash =
            normalizeTransactionHash(
                txHash
            );


        const [rows] =
            await pool.execute<RowDataPacket[]>(

                `
                SELECT
                    id,
                    tx_hash,
                    token_id,
                    buyer,
                    seller,
                    price,
                    event_type,
                    created_at
                FROM transactions
                WHERE tx_hash = ?
                LIMIT 1
                `,

                [normalizedHash]

            );


        return rows.length
            ? rows[0] as Transaction
            : null;

    }


    // ======================================================
    // Get All Transactions
    // ======================================================

    static async getAllTransactions(
        query: TransactionQuery
    ): Promise<Transaction[]> {

        const page =
            Math.max(
                Number(query.page ?? DEFAULT_PAGE),
                DEFAULT_PAGE
            );


        const limit =
            Math.min(
                Math.max(
                    Number(query.limit ?? DEFAULT_LIMIT),
                    1
                ),
                MAX_LIMIT
            );


        const offset =
            (page - 1) * limit;


        const allowedSort = [
            "created_at",
            "price",
            "token_id"
        ] as const;


        const sort =
            allowedSort.includes(
                query.sort as
                    typeof allowedSort[number]
            )
                ? query.sort!
                : "created_at";


        const order =
            query.order === "ASC"
                ? "ASC"
                : "DESC";


        let sql = `
            SELECT
                id,
                tx_hash,
                token_id,
                buyer,
                seller,
                price,
                event_type,
                created_at
            FROM transactions
            WHERE 1 = 1
        `;


        const values: (
            string | number
        )[] = [];


        // --------------------------------------------------
        // Transaction Hash
        // --------------------------------------------------

        if (query.tx_hash) {

            sql += `
                AND tx_hash = ?
            `;

            values.push(
                normalizeTransactionHash(
                    query.tx_hash
                )
            );

        }


        // --------------------------------------------------
        // Token ID
        // --------------------------------------------------

        if (
            query.token_id !== undefined
        ) {

            const tokenId =
                normalizeTokenId(
                    query.token_id
                );

            if (tokenId !== null) {

                sql += `
                    AND token_id = ?
                `;

                values.push(
                    tokenId
                );

            }

        }


        // --------------------------------------------------
        // Buyer
        // --------------------------------------------------

        if (query.buyer) {

            const buyer =
                normalizeAddress(
                    query.buyer
                );

            if (buyer) {

                sql += `
                    AND buyer = ?
                `;

                values.push(
                    buyer
                );

            }

        }


        // --------------------------------------------------
        // Seller
        // --------------------------------------------------

        if (query.seller) {

            const seller =
                normalizeAddress(
                    query.seller
                );

            if (seller) {

                sql += `
                    AND seller = ?
                `;

                values.push(
                    seller
                );

            }

        }


        // --------------------------------------------------
        // Event Type
        // --------------------------------------------------

        if (query.event_type) {

            sql += `
                AND event_type = ?
            `;

            values.push(
                query.event_type.trim()
            );

        }


        // --------------------------------------------------
        // Sorting
        // --------------------------------------------------

        sql += `
            ORDER BY ${sort} ${order}
            LIMIT ${limit}
            OFFSET ${offset}
        `;


        const [rows] =
            await pool.execute<RowDataPacket[]>(
                sql,
                values
            );


        return rows as Transaction[];

    }


    // ======================================================
    // Get Transactions By Token
    // ======================================================

    static async getTransactionsByToken(
        tokenId: number
    ): Promise<Transaction[]> {

        const normalizedTokenId =
            normalizeTokenId(
                tokenId
            );


        if (normalizedTokenId === null) {

            throw new Error(
                "Token ID is required"
            );

        }


        const [rows] =
            await pool.execute<RowDataPacket[]>(

                `
                SELECT
                    id,
                    tx_hash,
                    token_id,
                    buyer,
                    seller,
                    price,
                    event_type,
                    created_at
                FROM transactions
                WHERE token_id = ?
                ORDER BY created_at DESC
                `,

                [normalizedTokenId]

            );


        return rows as Transaction[];

    }


    // ======================================================
    // Get Transactions By Buyer
    // ======================================================

    static async getTransactionsByBuyer(
        buyer: string
    ): Promise<Transaction[]> {

        const normalizedBuyer =
            normalizeAddress(
                buyer
            );


        if (!normalizedBuyer) {

            throw new Error(
                "Buyer address is required"
            );

        }


        const [rows] =
            await pool.execute<RowDataPacket[]>(

                `
                SELECT
                    id,
                    tx_hash,
                    token_id,
                    buyer,
                    seller,
                    price,
                    event_type,
                    created_at
                FROM transactions
                WHERE buyer = ?
                ORDER BY created_at DESC
                `,

                [normalizedBuyer]

            );


        return rows as Transaction[];

    }


    // ======================================================
    // Get Transactions By Seller
    // ======================================================

    static async getTransactionsBySeller(
        seller: string
    ): Promise<Transaction[]> {

        const normalizedSeller =
            normalizeAddress(
                seller
            );


        if (!normalizedSeller) {

            throw new Error(
                "Seller address is required"
            );

        }


        const [rows] =
            await pool.execute<RowDataPacket[]>(

                `
                SELECT
                    id,
                    tx_hash,
                    token_id,
                    buyer,
                    seller,
                    price,
                    event_type,
                    created_at
                FROM transactions
                WHERE seller = ?
                ORDER BY created_at DESC
                `,

                [normalizedSeller]

            );


        return rows as Transaction[];

    }

}