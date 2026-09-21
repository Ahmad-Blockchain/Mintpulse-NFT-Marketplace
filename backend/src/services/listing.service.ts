import {
    ResultSetHeader,
    RowDataPacket
} from "mysql2";

import { pool } from "../config/database.js";

import { NFTService } from "./nft.service.js";

import {
    CreateListingBody,
    Listing,
    ListingQuery,
    UpdateListingBody
} from "../types/listing.types.js";


export class ListingService {

    // ==========================================================
    // Create Listing
    // ==========================================================

    static async createListing(
        seller: string,
        data: CreateListingBody
    ): Promise<number> {

        const nft =
            await NFTService.getNFTByTokenId(
                data.nft_id
            );

        if (!nft) {

            throw new Error(
                "NFT not found"
            );

        }

        if (
            nft.owner.toLowerCase() !==
            seller.toLowerCase()
        ) {

            throw new Error(
                "You are not the NFT owner"
            );

        }

        const [result] =
            await pool.execute<ResultSetHeader>(
                `
                INSERT INTO listings (
                    nft_id,
                    seller,
                    owner,
                    listing_type,
                    price,
                    payment_token,
                    expires_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    data.nft_id,
                    seller,
                    nft.owner,
                    data.listing_type ?? "fixed",
                    data.price,
                    data.payment_token,
                    data.expires_at ?? null
                ]
            );

        return result.insertId;

    }


    // ==========================================================
    // Get Active Listings
    // ==========================================================

    static async getActiveListings(): Promise<Listing[]> {

        const [rows] =
            await pool.execute<RowDataPacket[]>(
                `
                SELECT *
                FROM listings
                WHERE status = 'active'
                ORDER BY listed_at DESC
                `
            );

        return rows as Listing[];

    }


    // ==========================================================
    // Get Listing By ID
    // ==========================================================

    static async getListingById(
        id: number
    ): Promise<Listing | null> {

        const [rows] =
            await pool.execute<RowDataPacket[]>(
                `
                SELECT *
                FROM listings
                WHERE id = ?
                LIMIT 1
                `,
                [id]
            );

        return (rows[0] as Listing) ?? null;

    }


    // ==========================================================
    // Get All Listings
    // ==========================================================

    static async getAllListings(
        query: ListingQuery
    ): Promise<Listing[]> {

        const page = Math.max(
            Number(query.page ?? 1),
            1
        );

        const limit = Math.min(
            Math.max(
                Number(query.limit ?? 20),
                1
            ),
            100
        );

        const offset =
            (page - 1) * limit;


        // ------------------------------------------------------
        // Sort Whitelist
        // ------------------------------------------------------

        const allowedSortFields = {

            listed_at: "listed_at",

            price: "price",

            updated_at: "updated_at"

        } as const;

        const sort =
            allowedSortFields[
                query.sort as keyof typeof allowedSortFields
            ] ?? "listed_at";


        const order =
            query.order === "ASC"
                ? "ASC"
                : "DESC";


        // ------------------------------------------------------
        // Base Query
        // ------------------------------------------------------

        let sql = `
            SELECT *
            FROM listings
            WHERE 1 = 1
        `;

        const values: (
            string |
            number
        )[] = [];


        // ------------------------------------------------------
        // Seller Filter
        // ------------------------------------------------------

        if (query.seller) {

            sql += `
                AND seller = ?
            `;

            values.push(
                query.seller
            );

        }


        // ------------------------------------------------------
        // Owner Filter
        // ------------------------------------------------------

        if (query.owner) {

            sql += `
                AND owner = ?
            `;

            values.push(
                query.owner
            );

        }


        // ------------------------------------------------------
        // Status Filter
        // ------------------------------------------------------

        if (query.status) {

            sql += `
                AND status = ?
            `;

            values.push(
                query.status
            );

        }


        // ------------------------------------------------------
        // Listing Type Filter
        // ------------------------------------------------------

        if (query.listing_type) {

            sql += `
                AND listing_type = ?
            `;

            values.push(
                query.listing_type
            );

        }


        // ------------------------------------------------------
        // Minimum Price
        // ------------------------------------------------------

        if (
            query.min_price !== undefined
        ) {

            sql += `
                AND price >= ?
            `;

            values.push(
                query.min_price
            );

        }


        // ------------------------------------------------------
        // Maximum Price
        // ------------------------------------------------------

        if (
            query.max_price !== undefined
        ) {

            sql += `
                AND price <= ?
            `;

            values.push(
                query.max_price
            );

        }


        // ------------------------------------------------------
        // Pagination
        // ------------------------------------------------------

        sql += `
            ORDER BY ${sort} ${order}
            LIMIT ?
            OFFSET ?
        `;

        values.push(
            limit,
            offset
        );


        const [rows] =
            await pool.execute<RowDataPacket[]>(
                sql,
                values
            );

        return rows as Listing[];

    }


    // ==========================================================
    // Update Listing
    // ==========================================================

    static async updateListing(
        id: number,
        seller: string,
        data: UpdateListingBody
    ): Promise<void> {

        const listing =
            await this.getListingById(id);


        if (!listing) {

            throw new Error(
                "Listing not found"
            );

        }


        // ------------------------------------------------------
        // Ownership Check
        // ------------------------------------------------------

        if (
            listing.seller.toLowerCase() !==
            seller.toLowerCase()
        ) {

            throw new Error(
                "You are not the listing owner"
            );

        }


        // ------------------------------------------------------
        // Status Check
        // ------------------------------------------------------

        if (
            listing.status !== "active"
        ) {

            throw new Error(
                "Only active listings can be updated"
            );

        }


        const fields: string[] = [];

        const values: (
            string |
            number |
            null
        )[] = [];


        // ------------------------------------------------------
        // Price
        // ------------------------------------------------------

        if (
            data.price !== undefined
        ) {

            fields.push(
                "price = ?"
            );

            values.push(
                data.price
            );

        }


        // ------------------------------------------------------
        // Payment Token
        // ------------------------------------------------------

        if (
            data.payment_token !== undefined
        ) {

            fields.push(
                "payment_token = ?"
            );

            values.push(
                data.payment_token
            );

        }


        // ------------------------------------------------------
        // Expiration
        // ------------------------------------------------------

        if (
            data.expires_at !== undefined
        ) {

            fields.push(
                "expires_at = ?"
            );

            values.push(
                data.expires_at
            );

        }


        // ------------------------------------------------------
        // Prevent Empty Update
        // ------------------------------------------------------

        if (
            fields.length === 0
        ) {

            throw new Error(
                "No fields provided for update"
            );

        }


        fields.push(
            "updated_at = CURRENT_TIMESTAMP"
        );


        // ID is the final SQL parameter.
        values.push(id);


        await pool.execute(
            `
            UPDATE listings

            SET ${fields.join(", ")}

            WHERE id = ?

            AND seller = ?

            AND status = 'active'
            `,
            [
                ...values.slice(0, -1),
                id,
                seller
            ]
        );

    }


    // ==========================================================
    // Cancel Listing
    // ==========================================================

    static async cancelListing(
        id: number,
        seller: string
    ): Promise<void> {

        const listing =
            await this.getListingById(id);


        if (!listing) {

            throw new Error(
                "Listing not found"
            );

        }


        // ------------------------------------------------------
        // Ownership Check
        // ------------------------------------------------------

        if (
            listing.seller.toLowerCase() !==
            seller.toLowerCase()
        ) {

            throw new Error(
                "You are not the listing owner"
            );

        }


        // ------------------------------------------------------
        // Status Check
        // ------------------------------------------------------

        if (
            listing.status !== "active"
        ) {

            throw new Error(
                "Only active listings can be cancelled"
            );

        }


        await pool.execute<ResultSetHeader>(
            `
            UPDATE listings

            SET
                status = 'cancelled',
                updated_at = CURRENT_TIMESTAMP

            WHERE id = ?

            AND seller = ?

            AND status = 'active'
            `,
            [
                id,
                seller
            ]
        );

    }

}
