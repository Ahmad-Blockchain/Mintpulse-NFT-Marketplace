import { pool } from "../config/database.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { NFT, NFTQuery } from "../types/nft.types.js";

export class NFTService {

    // ==========================================================
    // Get All NFTs
    // ==========================================================

    static async getAllNFTs(
        query: NFTQuery
    ): Promise<NFT[]> {

        const page = Number(query.page ?? 1);
        const limit = Number(query.limit ?? 20);
        const offset = (page - 1) * limit;

        const allowedSort = [
            "name", 
            "minted_at", 
            "royalty"];

        const sort =
            allowedSort.includes(query.sort ?? "")
                ? query.sort ?? "minted_at"
                : "minted_at";
            
        const order = 
            query.order === "ASC"
                ? "ASC"
                : "DESC";

        let sql = `
            SELECT *
            FROM nfts
            WHERE is_burned = FALSE
        `;

        const values: any[] = [];

        // Search
        if (query.search) {

            sql += `
                AND (
                    name LIKE ?
                    OR description LIKE ?
                )
            `;

            values.push(
                `%${query.search}%`,
                `%${query.search}%`
            );

        }

        // Owner
        if (query.owner) {

            sql += `
                AND owner = ?
            `;

            values.push(query.owner);

        }

        // Creator
        if (query.creator) {

            sql += `
                AND creator = ?
            `;

            values.push(query.creator);

        }

        // Collection
        if (query.collection) {

            sql += `
                AND collection_id = ?
            `;

            values.push(query.collection);

        }

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

        return rows as NFT[];

    }

    // ==========================================================
    // Get NFT By Token ID
    // ==========================================================

    static async getNFTByTokenId(
        tokenId: number
    ): Promise<NFT | null> {

        const [rows] =
            await pool.execute<RowDataPacket[]>(

                `
                SELECT *
                FROM nfts
                WHERE token_id = ?
                LIMIT 1
                `,

                [tokenId]

            );

        return rows.length
            ? rows[0] as NFT
            : null;

    }

    // ==========================================================
    // Get NFTs By Owner
    // ==========================================================

    static async getNFTsByOwner(
        wallet: string
    ): Promise<NFT[]> {

        const [rows] =
            await pool.execute<RowDataPacket[]>(

                `
                SELECT *
                FROM nfts
                WHERE owner = ?
                AND is_burned = FALSE
                ORDER BY minted_at DESC
                `,

                [wallet]

            );

        return rows as NFT[];

    }

    // ==========================================================
    // Get NFTs By Creator
    // ==========================================================

    static async getNFTsByCreator(
        wallet: string
    ): Promise<NFT[]> {

        const [rows] =
            await pool.execute<RowDataPacket[]>(

                `
                SELECT *
                FROM nfts
                WHERE creator = ?
                AND is_burned = FALSE
                ORDER BY minted_at DESC
                `,

                [wallet]

            );

        return rows as NFT[];

    }

// ==========================================================
// Create / Sync NFT
// ==========================================================

static async createNFT(data: {

    token_id: number;

    contract_address: string;

    creator: string;

    owner: string;

    metadata_uri: string;

    image_url?: string | null;

    name?: string | null;

    description?: string | null;

    collection_id?: number | null;

    animation_url?: string | null;

    external_url?: string | null;

    attributes?: unknown | null;

    blockchain?: string;

    royalty?: number;

    minted_tx_hash?: string | null;

    minted_block?: number | null;

}): Promise<number> {

    const [result] =
        await pool.execute<ResultSetHeader>(
            `
            INSERT INTO nfts (

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
                minted_block

            )

            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?
            )

            ON DUPLICATE KEY UPDATE

                owner = VALUES(owner),

                metadata_uri =
                    VALUES(metadata_uri),

                image_url =
                    VALUES(image_url),

                animation_url =
                    VALUES(animation_url),

                external_url =
                    VALUES(external_url),

                name =
                    VALUES(name),

                description =
                    VALUES(description),

                attributes =
                    VALUES(attributes),

                collection_id =
                    VALUES(collection_id),

                royalty =
                    VALUES(royalty),

                updated_at =
                    CURRENT_TIMESTAMP
            `,
            [
                data.token_id,
                data.contract_address,
                data.creator,
                data.owner,
                data.collection_id ?? null,
                data.metadata_uri,
                data.image_url ?? null,
                data.animation_url ?? null,
                data.external_url ?? null,
                data.name ?? null,
                data.description ?? null,
                data.attributes
                    ? JSON.stringify(data.attributes)
                    : null,
                data.blockchain ?? "ethereum",
                data.royalty ?? 0,
                data.minted_tx_hash ?? null,
                data.minted_block ?? null
            ]
        );

    return result.insertId;

}

}