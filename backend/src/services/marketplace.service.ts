// ==========================================================
// MintPulse Marketplace Service
// Production-Ready Marketplace Database Service
// ==========================================================

import { pool } from "../config/database.js";

import type {
    ResultSetHeader,
    RowDataPacket
} from "mysql2";

// ==========================================================
// Marketplace Service
// ==========================================================

export class MarketplaceService {

    // ======================================================
    // Create Listing
    // ======================================================

    static async createListing(
        tokenId: number,
        contractAddress: string,
        seller: string,
        price: string,
        transactionHash?: string
    ): Promise<number> {

        const connection =
            await pool.getConnection();

        try {

            await connection.beginTransaction();

            const normalizedContract =
                contractAddress.toLowerCase();

            const normalizedSeller =
                seller.toLowerCase();

            // ==================================================
            // Find NFT
            // ==================================================

            const [nftRows] =
                await connection.execute<RowDataPacket[]>(
                    `
                    SELECT
                        id,
                        owner,
                        token_id,
                        contract_address
                    FROM nfts
                    WHERE token_id = ?
                    AND contract_address = ?
                    LIMIT 1
                    `,
                    [
                        tokenId,
                        normalizedContract
                    ]
                );

            if (nftRows.length === 0) {

                throw new Error(
                    `NFT not found: ${normalizedContract}:${tokenId}`
                );

            }

            const nftId =
                Number(nftRows[0].id);

            // ==================================================
            // Verify Ownership
            // ==================================================

            const currentOwner =
                String(nftRows[0].owner).toLowerCase();

            if (currentOwner !== normalizedSeller) {

                throw new Error(
                    `Seller does not own NFT ${tokenId}`
                );

            }

            // ==================================================
            // Check Existing Active Listing
            // ==================================================

            const [existingRows] =
                await connection.execute<RowDataPacket[]>(
                    `
                    SELECT
                        id
                    FROM listings
                    WHERE nft_id = ?
                    AND status = 'active'
                    LIMIT 1
                    `,
                    [
                        nftId
                    ]
                );

            if (existingRows.length > 0) {

                throw new Error(
                    `NFT ${tokenId} already has an active listing`
                );

            }

            // ==================================================
            // Create Listing
            // ==================================================

            const [result] =
                await connection.execute<ResultSetHeader>(
                    `
                    INSERT INTO listings
                    (
                        nft_id,
                        seller,
                        owner,
                        listing_type,
                        price,
                        payment_token,
                        marketplace_fee,
                        royalty_fee,
                        status,
                        transaction_hash
                    )
                    VALUES
                    (
                        ?,
                        ?,
                        ?,
                        'fixed',
                        ?,
                        ?,
                        2.50,
                        0.00,
                        'active',
                        ?
                    )
                    `,
                    [
                        nftId,

                        normalizedSeller,

                        normalizedSeller,

                        price,

                        "0x0000000000000000000000000000000000000000",

                        transactionHash ?? null
                    ]
                );

            await connection.commit();

            console.log(
                `[MARKETPLACE] Listing created: NFT ${tokenId}`
            );

            return result.insertId;

        } catch (error) {

            await connection.rollback();

            throw error;

        } finally {

            connection.release();

        }

    }

    // ======================================================
    // Get Active Listings
    // ======================================================

    static async getActiveListings(): Promise<RowDataPacket[]> {

        const [rows] =
            await pool.execute<RowDataPacket[]>(
                `
                SELECT
                    l.id,
                    l.nft_id,
                    n.token_id,
                    n.contract_address,
                    l.seller,
                    l.owner,
                    l.listing_type,
                    l.price,
                    l.payment_token,
                    l.marketplace_fee,
                    l.royalty_fee,
                    l.status,
                    l.transaction_hash,
                    l.expires_at,
                    l.listed_at,
                    l.updated_at
                FROM listings l
                INNER JOIN nfts n
                    ON n.id = l.nft_id
                WHERE l.status = 'active'
                AND n.is_burned = FALSE
                ORDER BY l.listed_at DESC
                `
            );

        return rows;

    }

    // ======================================================
    // Get Listing By Token ID
    // ======================================================

    static async getListingByTokenId(
        tokenId: number,
        contractAddress?: string
    ): Promise<RowDataPacket | null> {

        let sql = `
            SELECT
                l.id,
                l.nft_id,
                n.token_id,
                n.contract_address,
                l.seller,
                l.owner,
                l.listing_type,
                l.price,
                l.payment_token,
                l.marketplace_fee,
                l.royalty_fee,
                l.status,
                l.transaction_hash,
                l.expires_at,
                l.listed_at,
                l.updated_at
            FROM listings l
            INNER JOIN nfts n
                ON n.id = l.nft_id
            WHERE n.token_id = ?
            AND l.status = 'active'
        `;

        const values: any[] = [
            tokenId
        ];

        // ==================================================
        // Optional Contract Filter
        // ==================================================

        if (contractAddress) {

            sql += `
                AND n.contract_address = ?
            `;

            values.push(
                contractAddress.toLowerCase()
            );

        }

        sql += `
            ORDER BY l.listed_at DESC
            LIMIT 1
        `;

        const [rows] =
            await pool.execute<RowDataPacket[]>(
                sql,
                values
            );

        return rows.length > 0
            ? rows[0]
            : null;

    }

    // ======================================================
    // Mark Listing As Sold
    // ======================================================

    static async markAsSold(
        tokenId: number,
        buyer: string
    ): Promise<void> {

        const normalizedBuyer =
            buyer.toLowerCase();

        // ==================================================
        // Find NFT
        // ==================================================

        const [nftRows] =
            await pool.execute<RowDataPacket[]>(
                `
                SELECT
                    id
                FROM nfts
                WHERE token_id = ?
                LIMIT 1
                `,
                [
                    tokenId
                ]
            );

        if (nftRows.length === 0) {

            throw new Error(
                `NFT not found for token ID ${tokenId}`
            );

        }

        const nftId =
            Number(nftRows[0].id);

        // ==================================================
        // Find Active Listing
        // ==================================================

        const [listingRows] =
            await pool.execute<RowDataPacket[]>(
                `
                SELECT
                    id
                FROM listings
                WHERE nft_id = ?
                AND status = 'active'
                ORDER BY listed_at DESC
                LIMIT 1
                `,
                [
                    nftId
                ]
            );

        if (listingRows.length === 0) {

            console.log(
                `[MARKETPLACE] No active listing found for NFT ${tokenId}`
            );

            return;

        }

        const listingId =
            Number(listingRows[0].id);

        // ==================================================
        // Mark Listing Sold
        // ==================================================

        await pool.execute<ResultSetHeader>(
            `
            UPDATE listings
            SET
                status = 'sold',
                owner = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            AND status = 'active'
            `,
            [
                normalizedBuyer,
                listingId
            ]
        );

        // ==================================================
        // Update NFT Owner
        // ==================================================

        await pool.execute<ResultSetHeader>(
            `
            UPDATE nfts
            SET
                owner = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            `,
            [
                normalizedBuyer,
                nftId
            ]
        );

        console.log(
            `[MARKETPLACE] Listing ${listingId} marked as sold`
        );

        console.log(
            `[MARKETPLACE] NFT ${tokenId} owner updated to ${normalizedBuyer}`
        );

    }

    // ======================================================
    // Cancel Listing
    // ======================================================

    static async cancelListing(
        tokenId: number
    ): Promise<void> {

        const [nftRows] =
            await pool.execute<RowDataPacket[]>(
                `
                SELECT
                    id
                FROM nfts
                WHERE token_id = ?
                LIMIT 1
                `,
                [
                    tokenId
                ]
            );

        if (nftRows.length === 0) {

            throw new Error(
                `NFT not found for token ID ${tokenId}`
            );

        }

        const nftId =
            Number(nftRows[0].id);

        const [result] =
            await pool.execute<ResultSetHeader>(
                `
                UPDATE listings
                SET
                    status = 'cancelled',
                    updated_at = CURRENT_TIMESTAMP
                WHERE nft_id = ?
                AND status = 'active'
                `,
                [
                    nftId
                ]
            );

        if (result.affectedRows === 0) {

            throw new Error(
                `No active listing found for NFT ${tokenId}`
            );

        }

        console.log(
            `[MARKETPLACE] Listing cancelled for NFT ${tokenId}`
        );

    }

    // ======================================================
    // Update Listing Price
    // ======================================================

    static async updatePrice(
        tokenId: number,
        price: string
    ): Promise<void> {

        const [nftRows] =
            await pool.execute<RowDataPacket[]>(
                `
                SELECT
                    id
                FROM nfts
                WHERE token_id = ?
                LIMIT 1
                `,
                [
                    tokenId
                ]
            );

        if (nftRows.length === 0) {

            throw new Error(
                `NFT not found for token ID ${tokenId}`
            );

        }

        const nftId =
            Number(nftRows[0].id);

        const [result] =
            await pool.execute<ResultSetHeader>(
                `
                UPDATE listings
                SET
                    price = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE nft_id = ?
                AND status = 'active'
                `,
                [
                    price,
                    nftId
                ]
            );

        if (result.affectedRows === 0) {

            throw new Error(
                `No active listing found for NFT ${tokenId}`
            );

        }

        console.log(
            `[MARKETPLACE] Price updated for NFT ${tokenId}`
        );

    }

}