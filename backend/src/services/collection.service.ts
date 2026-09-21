import { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../config/database.js";

import {
    Collection,
    CollectionQuery,
    CreateCollectionBody,
    UpdateCollectionBody
} from "../types/collection.types.js";

export class CollectionService {

    // ==========================================================
    // Create Collection
    // ==========================================================

    static async createCollection(
        data: CreateCollectionBody
    ): Promise<number> {

        const [result] = await pool.execute<ResultSetHeader>(

            `
            INSERT INTO collections
            (
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
                blockchain
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,

            [
                data.contract_address,
                data.creator,
                data.name,
                data.slug,
                data.symbol ?? null,
                data.description ?? null,
                data.logo_image ?? null,
                data.banner_image ?? null,
                data.featured_image ?? null,
                data.website ?? null,
                data.discord ?? null,
                data.telegram ?? null,
                data.twitter ?? null,
                data.instagram ?? null,
                data.royalty ?? 0,
                data.blockchain ?? "ethereum"
            ]

        );

        return result.insertId;

    }

    // ==========================================================
    // Get All Collections
    // ==========================================================

    static async getAllCollections(
    query: CollectionQuery
): Promise<Collection[]> {

    const page = Math.max(Number(query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
    const offset = (page - 1) * limit;

    const allowedSort = [
        "created_at",
        "name",
        "volume",
        "floor_price",
        "owners"
    ];

    const sort = allowedSort.includes(query.sort ?? "")
        ? query.sort!
        : "created_at";

    const order = query.order === "ASC"
        ? "ASC"
        : "DESC";

    let sql = `
        SELECT *
        FROM collections
        WHERE 1=1
    `;

    const values: (string | number | boolean | null)[] = [];

    if (query.search) {

        sql += `
            AND (
                name LIKE ?
                OR slug LIKE ?
            )
        `;

        values.push(
            `%${query.search}%`,
            `%${query.search}%`
        );

    }

    if (query.creator) {

        sql += `
            AND creator = ?
        `;

        values.push(query.creator);

    }

    if (query.blockchain) {

        sql += `
            AND blockchain = ?
        `;

        values.push(query.blockchain);

    }

    if (query.verified !== undefined) {

        sql += `
            AND verified = ?
        `;

        values.push(query.verified);

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

    return rows as Collection[];

}

    // ==========================================================
    // Get Collection By ID
    // ==========================================================

    static async getCollectionById(
        id: number
    ): Promise<Collection | null> {

        const [rows] = await pool.execute<RowDataPacket[]>(

            `
            SELECT *
            FROM collections
            WHERE id = ?
            LIMIT 1
            `,

            [id]

        );

        return rows[0] as Collection ?? null;

    }

    // ==========================================================
    // Get Collection By Slug
    // ==========================================================

    static async getCollectionBySlug(
        slug: string
    ): Promise<Collection | null> {

        const [rows] = await pool.execute<RowDataPacket[]>(

            `
            SELECT *
            FROM collections
            WHERE slug = ?
            LIMIT 1
            `,

            [slug]

        );

        return rows[0] as Collection ?? null;

    }

    // ==========================================================
    // Update Collection
    // ==========================================================

    static async updateCollection(

        id: number,
        
        data: UpdateCollectionBody
    
    ): Promise<void> {
        
        await pool.execute(
            
            `
                UPDATE collections
                    SET

                        name=?,

                        symbol=?,

                        description=?,

                        logo_image=?,

                        banner_image=?,

                        featured_image=?,

                        website=?,

                        discord=?,

                        telegram=?,

                        twitter=?,

                        instagram=?,

                        royalty=?,

                        updated_at=CURRENT_TIMESTAMP

                        WHERE id=?
                     `,
                     
                     [

                        data.name ?? null,

                        data.symbol ?? null,

                        data.description ?? null,

                        data.logo_image ?? null,

                        data.banner_image ?? null,

                        data.featured_image ?? null,

                        data.website ?? null,

                        data.discord ?? null,

                        data.telegram ?? null,

                        data.twitter ?? null,

                        data.instagram ?? null,

                        data.royalty ?? 0,

                        id
                    
                    ]
                
                );
            
            }

    // ==========================================================
    // Delete Collection
    // ==========================================================

    static async deleteCollection(
        
        id: number
    
    ): Promise<void> {
        
        await pool.execute(
            
            `
            DELETE
            FROM collections
            WHERE id=?
            `,

            [

                id
            
            ]
        
        );
    
    }

}