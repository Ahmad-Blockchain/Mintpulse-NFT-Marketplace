import { pool } from "../config/database.js";

import {
    RowDataPacket
} from "mysql2";

// ==========================================================
// Admin User Types
// ==========================================================

export interface AdminUser {

    id: number;

    wallet_address: string;

    username: string;

    profile_Image: string | null;

    bio: string | null;

    nonce: string | null;

    created_at: Date;

    updated_at: Date;

}

export interface AdminUserQuery {

    page?: number;

    limit?: number;

    search?: string;

}

export interface AdminUsersResult {

    users: AdminUser[];

    pagination: {

        page: number;

        limit: number;

        total: number;

        totalPages: number;

    };

}

// ==========================================================
// Admin NFT Types
// ==========================================================

export interface AdminNFT {

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

    attributes: unknown;

    blockchain: string;

    royalty: number;

    minted_tx_hash: string | null;

    minted_block: number | null;

    minted_at: Date;

    updated_at: Date;

    is_burned: boolean;

}

export interface AdminNFTQuery {

    page?: number;

    limit?: number;

    search?: string;

    owner?: string;

    creator?: string;

}

export interface AdminNFTsResult {

    nfts: AdminNFT[];

    pagination: {

        page: number;

        limit: number;

        total: number;

        totalPages: number;

    };

}

// ==========================================================
// Admin Service
// ==========================================================

export class AdminService {

    // ======================================================
    // Get Users
    // ======================================================

    static async getUsers(
        query: AdminUserQuery
    ): Promise<AdminUsersResult> {

        const page =
            Math.max(
                Number(query.page ?? 1),
                1
            );

        const limit =
            Math.min(
                Math.max(
                    Number(query.limit ?? 20),
                    1
                ),
                100
            );

        const offset =
            (page - 1) * limit;

        const values: (
            string | number | null
        )[] = [];

        let whereClause = "";

        if (query.search?.trim()) {

            whereClause = `
                WHERE
                    wallet_address LIKE ?
                    OR username LIKE ?
            `;

            const search =
                `%${query.search.trim()}%`;

            values.push(
                search,
                search
            );

        }

        const [countRows] =
            await pool.execute<RowDataPacket[]>(
                `
                SELECT COUNT(*) AS total
                FROM users
                ${whereClause}
                `,
                values
            );

        const total =
            Number(
                countRows[0]?.total ?? 0
            );

        const totalPages =
            total === 0
                ? 0
                : Math.ceil(
                    total / limit
                );

        const [rows] =
            await pool.execute<RowDataPacket[]>(
                `
                SELECT
                    id,
                    wallet_address,
                    username,
                    profile_Image,
                    bio,
                    nonce,
                    created_at,
                    updated_at
                FROM users
                ${whereClause}
                ORDER BY created_at DESC
                LIMIT ?
                OFFSET ?
                `,
                [
                    ...values,
                    limit,
                    offset
                ]
            );

        return {

            users:
                rows as AdminUser[],

            pagination: {

                page,

                limit,

                total,

                totalPages

            }

        };

    }

    // ======================================================
    // Get User By Wallet
    // ======================================================

    static async getUserByWallet(
        wallet: string
    ): Promise<AdminUser | null> {

        const [rows] =
            await pool.execute<RowDataPacket[]>(
                `
                SELECT
                    id,
                    wallet_address,
                    username,
                    profile_Image,
                    bio,
                    nonce,
                    created_at,
                    updated_at
                FROM users
                WHERE wallet_address = ?
                LIMIT 1
                `,
                [wallet]
            );

        if (!rows.length) {

            return null;

        }

        return rows[0] as AdminUser;

    }

    // ======================================================
    // Get NFTs
    // ======================================================

    static async getNFTs(
        query: AdminNFTQuery
    ): Promise<AdminNFTsResult> {

        const page =
            Math.max(
                Number(query.page ?? 1),
                1
            );

        const limit =
            Math.min(
                Math.max(
                    Number(query.limit ?? 20),
                    1
                ),
                100
            );

        const offset =
            (page - 1) * limit;

        const values: (
            string | number | boolean | null
        )[] = [];

        const conditions: string[] = [
            "is_burned = FALSE"
        ];

        // ==================================================
        // Search
        // ==================================================

        if (query.search?.trim()) {

            conditions.push(`
                (
                    name LIKE ?
                    OR description LIKE ?
                    OR contract_address LIKE ?
                    OR CAST(token_id AS CHAR) LIKE ?
                )
            `);

            const search =
                `%${query.search.trim()}%`;

            values.push(
                search,
                search,
                search,
                search
            );

        }

        // ==================================================
        // Owner
        // ==================================================

        if (query.owner?.trim()) {

            conditions.push(
                "owner = ?"
            );

            values.push(
                query.owner.trim()
            );

        }

        // ==================================================
        // Creator
        // ==================================================

        if (query.creator?.trim()) {

            conditions.push(
                "creator = ?"
            );

            values.push(
                query.creator.trim()
            );

        }

        const whereClause =
            `WHERE ${conditions.join(" AND ")}`;

        // ==================================================
        // Count
        // ==================================================

        const [countRows] =
            await pool.execute<RowDataPacket[]>(
                `
                SELECT COUNT(*) AS total
                FROM nfts
                ${whereClause}
                `,
                values
            );

        const total =
            Number(
                countRows[0]?.total ?? 0
            );

        const totalPages =
            total === 0
                ? 0
                : Math.ceil(
                    total / limit
                );

        // ==================================================
        // NFTs
        // ==================================================

        const [rows] =
            await pool.execute<RowDataPacket[]>(
                `
                SELECT
                    id,
                    token_id,
                    contract_address,
                    creator,
                    owner,
                    collection_id,
                    metadata_uri,
                    image_url,
                    animation_url,
                    external_url,
                    name,
                    description,
                    attributes,
                    blockchain,
                    royalty,
                    minted_tx_hash,
                    minted_block,
                    minted_at,
                    updated_at,
                    is_burned
                FROM nfts
                ${whereClause}
                ORDER BY minted_at DESC
                LIMIT ?
                OFFSET ?
                `,
                [
                    ...values,
                    limit,
                    offset
                ]
            );

        return {

            nfts:
                rows as AdminNFT[],

            pagination: {

                page,

                limit,

                total,

                totalPages

            }

        };

    }

    // ======================================================
// Get NFT By Token ID
// ======================================================

static async getNFTsByTokenId(
    tokenId: number
): Promise<AdminNFT | null> {

    const [rows] =
        await pool.execute<RowDataPacket[]>(
            `
            SELECT
                id,
                token_id,
                contract_address,
                creator,
                owner,
                collection_id,
                metadata_uri,
                image_url,
                animation_url,
                external_url,
                name,
                description,
                attributes,
                blockchain,
                royalty,
                minted_tx_hash,
                minted_block,
                minted_at,
                updated_at,
                is_burned
            FROM nfts
            WHERE token_id = ?
            LIMIT 1
            `,
            [tokenId]
        );

    if (!rows.length) {
        return null;
    }

    return rows[0] as AdminNFT;
}

// ======================================================
// Get Collections
// ======================================================

static async getCollections(
    query: {
        page?: number;
        limit?: number;
        search?: string;
        verified?: boolean;
        creator?: string;
        blockchain?: string;
        sort?:
            | "created_at"
            | "name"
            | "volume"
            | "floor_price"
            | "owners";
        order?: "ASC" | "DESC";
    }
) {

    const page =
        Math.max(
            Number(query.page ?? 1),
            1
        );

    const limit =
        Math.min(
            Math.max(
                Number(query.limit ?? 20),
                1
            ),
            100
        );

    const offset =
        (page - 1) * limit;

    const values:
        (string | number | boolean)[] = [];

    let whereClause = "";

    if (query.search?.trim()) {

        whereClause += `
            AND (
                name LIKE ?
                OR slug LIKE ?
                OR contract_address LIKE ?
            )
        `;

        const search =
            `%${query.search.trim()}%`;

        values.push(
            search,
            search,
            search
        );
    }

    if (query.verified !== undefined) {

        whereClause += `
            AND verified = ?
        `;

        values.push(
            query.verified
        );
    }

    if (query.creator) {

        whereClause += `
            AND creator = ?
        `;

        values.push(
            query.creator
        );
    }

    if (query.blockchain) {

        whereClause += `
            AND blockchain = ?
        `;

        values.push(
            query.blockchain
        );
    }

    const allowedSorts = [
        "created_at",
        "name",
        "volume",
        "floor_price",
        "owners",
    ];

    const sort =
        allowedSorts.includes(
            query.sort ?? ""
        )
            ? query.sort!
            : "created_at";

    const order =
        query.order === "ASC"
            ? "ASC"
            : "DESC";

    const [countRows] =
        await pool.execute<RowDataPacket[]>(
            `
            SELECT COUNT(*) AS total
            FROM collections
            WHERE 1=1
            ${whereClause}
            `,
            values
        );

    const total =
        Number(
            countRows[0]?.total ?? 0
        );

    const totalPages =
        total === 0
            ? 0
            : Math.ceil(
                total / limit
            );

    const [rows] =
        await pool.execute<RowDataPacket[]>(
            `
            SELECT
                id,
                contract_address,
                creator,
                name,
                slug,
                symbol,
                description,
                logo_image,
                banner_image,
                featured_image,
                website,
                discord,
                telegram,
                twitter,
                instagram,
                royalty,
                blockchain,
                verified,
                total_supply,
                floor_price,
                volume,
                owners,
                created_at,
                updated_at
            FROM collections
            WHERE 1=1
            ${whereClause}
            ORDER BY ${sort} ${order}
            LIMIT ${limit}
            OFFSET ${offset}
            `,
            values
        );

    return {

        collections:
            rows,

        pagination: {

            page,
            limit,
            total,
            totalPages,

        },

    };

}


// ======================================================
// Get Collection By ID
// ======================================================

static async getCollectionById(
    id: number
) {

    const [rows] =
        await pool.execute<RowDataPacket[]>(
            `
            SELECT
                id,
                contract_address,
                creator,
                name,
                slug,
                symbol,
                description,
                logo_image,
                banner_image,
                featured_image,
                website,
                discord,
                telegram,
                twitter,
                instagram,
                royalty,
                blockchain,
                verified,
                total_supply,
                floor_price,
                volume,
                owners,
                created_at,
                updated_at
            FROM collections
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

    return rows[0] ?? null;

}

}