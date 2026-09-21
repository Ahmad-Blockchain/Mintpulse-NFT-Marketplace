import {
    ResultSetHeader,
    RowDataPacket
} from "mysql2";

import { pool } from "../config/database.js";

import { NFTService } from "./nft.service.js";

import {
    CreateOfferBody,
    Offer,
    OfferQuery,
    UpdateOfferBody
} from "../types/offer.types.js";


export class OfferService {

    // ==========================================================
    // Create Offer
    // ==========================================================

    static async createOffer(
        buyer: string,
        data: CreateOfferBody
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

        // ------------------------------------------------------
        // Owner Cannot Offer On Own NFT
        // ------------------------------------------------------

        if (
            nft.owner.toLowerCase() ===
            buyer.toLowerCase()
        ) {

            throw new Error(
                "NFT owner cannot make an offer"
            );

        }

        // ------------------------------------------------------
        // Validate Price
        // ------------------------------------------------------

        if (
            !Number.isFinite(data.offered_price) ||
            data.offered_price <= 0
        ) {

            throw new Error(
                "Offer price must be greater than zero"
            );

        }

        // ------------------------------------------------------
        // Check Existing Active Offer
        // ------------------------------------------------------

        const [existingRows] =
            await pool.execute<RowDataPacket[]>(
                `
                SELECT id
                FROM offers
                WHERE nft_id = ?
                AND buyer = ?
                AND status = 'active'
                LIMIT 1
                `,
                [
                    data.nft_id,
                    buyer
                ]
            );

        if (existingRows.length > 0) {

            throw new Error(
                "You already have an active offer for this NFT"
            );

        }

        // ------------------------------------------------------
        // Create Offer
        // ------------------------------------------------------

        const [result] =
            await pool.execute<ResultSetHeader>(
                `
                INSERT INTO offers (

                    nft_id,
                    buyer,
                    offered_price,
                    payment_token,
                    status,
                    expires_at

                )

                VALUES (?, ?, ?, ?, 'active', ?)
                `,
                [
                    data.nft_id,
                    buyer,
                    data.offered_price,
                    data.payment_token,
                    data.expires_at ?? null
                ]
            );

        return result.insertId;

    }


    // ==========================================================
    // Get Offer By ID
    // ==========================================================

    static async getOfferById(
        id: number
    ): Promise<Offer | null> {

        const [rows] =
            await pool.execute<RowDataPacket[]>(
                `
                SELECT
                    o.*,
                    n.owner AS current_owner

                FROM offers o

                INNER JOIN nfts n
                    ON n.id = o.nft_id

                WHERE o.id = ?

                LIMIT 1
                `,
                [
                    id
                ]
            );

        if (rows.length === 0) {

            return null;

        }

        return rows[0] as Offer;

    }


    // ==========================================================
    // Get Offers For NFT
    // ==========================================================

    static async getOffersByNFT(
        nftId: number
    ): Promise<Offer[]> {

        const [rows] =
            await pool.execute<RowDataPacket[]>(
                `
                SELECT
                    o.*,
                    n.owner AS current_owner

                FROM offers o

                INNER JOIN nfts n
                    ON n.id = o.nft_id

                WHERE o.nft_id = ?

                ORDER BY o.created_at DESC
                `,
                [
                    nftId
                ]
            );

        return rows as Offer[];

    }


    // ==========================================================
    // Get All Offers
    // ==========================================================

    static async getAllOffers(
        query: OfferQuery
    ): Promise<Offer[]> {

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
        // Safe Sort
        // ------------------------------------------------------

        const allowedSorts: Record<
            string,
            string
        > = {

            offered_price: "o.offered_price",

            created_at: "o.created_at",

            expires_at: "o.expires_at"

        };

        const sort =
            allowedSorts[
                query.sort ?? "created_at"
            ] ?? "o.created_at";


        const order =
            query.order === "ASC"
                ? "ASC"
                : "DESC";


        // ------------------------------------------------------
        // Base Query
        // ------------------------------------------------------

        let sql = `
            SELECT
                o.*,
                n.owner AS current_owner

            FROM offers o

            INNER JOIN nfts n
                ON n.id = o.nft_id

            WHERE 1 = 1
        `;


        const values: Array<
            string | number
        > = [];


        // ------------------------------------------------------
        // NFT
        // ------------------------------------------------------

        if (
            query.nft_id !== undefined
        ) {

            sql += `
                AND o.nft_id = ?
            `;

            values.push(
                query.nft_id
            );

        }


        // ------------------------------------------------------
        // Buyer
        // ------------------------------------------------------

        if (query.buyer) {

            sql += `
                AND o.buyer = ?
            `;

            values.push(
                query.buyer
            );

        }


        // ------------------------------------------------------
        // Status
        // ------------------------------------------------------

        if (query.status) {

            sql += `
                AND o.status = ?
            `;

            values.push(
                query.status
            );

        }


        // ------------------------------------------------------
        // Minimum Price
        // ------------------------------------------------------

        if (
            query.min_price !== undefined
        ) {

            sql += `
                AND o.offered_price >= ?
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
                AND o.offered_price <= ?
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

        return rows as Offer[];

    }


    // ==========================================================
    // Get My Offers
    // ==========================================================

    static async getOffersByBuyer(
        buyer: string
    ): Promise<Offer[]> {

        const [rows] =
            await pool.execute<RowDataPacket[]>(
                `
                SELECT
                    o.*,
                    n.owner AS current_owner

                FROM offers o

                INNER JOIN nfts n
                    ON n.id = o.nft_id

                WHERE o.buyer = ?

                ORDER BY o.created_at DESC
                `,
                [
                    buyer
                ]
            );

        return rows as Offer[];

    }


    // ==========================================================
    // Get Received Offers
    // ==========================================================

    static async getOffersForOwner(
        owner: string
    ): Promise<Offer[]> {

        const [rows] =
            await pool.execute<RowDataPacket[]>(
                `
                SELECT
                    o.*,
                    n.owner AS current_owner

                FROM offers o

                INNER JOIN nfts n
                    ON n.id = o.nft_id

                WHERE n.owner = ?

                ORDER BY o.created_at DESC
                `,
                [
                    owner
                ]
            );

        return rows as Offer[];

    }


    // ==========================================================
    // Update Offer
    // ==========================================================

    static async updateOffer(
        id: number,
        buyer: string,
        data: UpdateOfferBody
    ): Promise<void> {

        const offer =
            await this.getOfferById(id);

        if (!offer) {

            throw new Error(
                "Offer not found"
            );

        }


        if (
            offer.buyer.toLowerCase() !==
            buyer.toLowerCase()
        ) {

            throw new Error(
                "You are not the offer owner"
            );

        }


        if (
            offer.status !== "active"
        ) {

            throw new Error(
                "Only active offers can be updated"
            );

        }


        const fields: string[] = [];

        const values: Array<
            string | number | null
        > = [];


        // ------------------------------------------------------
        // Price
        // ------------------------------------------------------

        if (
            data.offered_price !== undefined
        ) {

            if (
                !Number.isFinite(
                    data.offered_price
                ) ||
                data.offered_price <= 0
            ) {

                throw new Error(
                    "Offer price must be greater than zero"
                );

            }

            fields.push(
                "offered_price = ?"
            );

            values.push(
                data.offered_price
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

        values.push(
            id,
            buyer
        );


        await pool.execute<ResultSetHeader>(
            `
            UPDATE offers

            SET ${fields.join(", ")}

            WHERE id = ?

            AND buyer = ?

            AND status = 'active'
            `,
            values
        );

    }


    // ==========================================================
    // Cancel Offer
    // ==========================================================

    static async cancelOffer(
        id: number,
        buyer: string
    ): Promise<void> {

        const offer =
            await this.getOfferById(id);

        if (!offer) {

            throw new Error(
                "Offer not found"
            );

        }


        if (
            offer.buyer.toLowerCase() !==
            buyer.toLowerCase()
        ) {

            throw new Error(
                "You are not the offer owner"
            );

        }


        if (
            offer.status !== "active"
        ) {

            throw new Error(
                "Only active offers can be cancelled"
            );

        }


        await pool.execute<ResultSetHeader>(
            `
            UPDATE offers

            SET
                status = 'cancelled',
                updated_at = CURRENT_TIMESTAMP

            WHERE id = ?

            AND buyer = ?

            AND status = 'active'
            `,
            [
                id,
                buyer
            ]
        );

    }


    // ==========================================================
    // Reject Offer
    // ==========================================================

    static async rejectOffer(
        id: number,
        owner: string
    ): Promise<void> {

        const offer =
            await this.getOfferById(id);

        if (!offer) {

            throw new Error(
                "Offer not found"
            );

        }


        const nft =
            await NFTService.getNFTByTokenId(
                offer.nft_id
            );

        if (!nft) {

            throw new Error(
                "NFT not found"
            );

        }


        if (
            nft.owner.toLowerCase() !==
            owner.toLowerCase()
        ) {

            throw new Error(
                "You are not the current NFT owner"
            );

        }


        if (
            offer.status !== "active"
        ) {

            throw new Error(
                "Only active offers can be rejected"
            );

        }


        await pool.execute<ResultSetHeader>(
            `
            UPDATE offers

            SET
                status = 'rejected',
                updated_at = CURRENT_TIMESTAMP

            WHERE id = ?

            AND status = 'active'
            `,
            [
                id
            ]
        );

    }


    // ==========================================================
    // Accept Offer
    // ==========================================================

    static async acceptOffer(
        id: number,
        owner: string
    ): Promise<void> {

        const offer =
            await this.getOfferById(id);

        if (!offer) {

            throw new Error(
                "Offer not found"
            );

        }


        const nft =
            await NFTService.getNFTByTokenId(
                offer.nft_id
            );

        if (!nft) {

            throw new Error(
                "NFT not found"
            );

        }


        if (
            nft.owner.toLowerCase() !==
            owner.toLowerCase()
        ) {

            throw new Error(
                "You are not the current NFT owner"
            );

        }


        if (
            offer.status !== "active"
        ) {

            throw new Error(
                "Only active offers can be accepted"
            );

        }


        // ------------------------------------------------------
        // Expiration Check
        // ------------------------------------------------------

        if (
            offer.expires_at &&
            offer.expires_at.getTime() <=
            Date.now()
        ) {

            await pool.execute<ResultSetHeader>(
                `
                UPDATE offers

                SET
                    status = 'expired',
                    updated_at = CURRENT_TIMESTAMP

                WHERE id = ?

                AND status = 'active'
                `,
                [
                    id
                ]
            );

            throw new Error(
                "Offer has expired"
            );

        }


        // ------------------------------------------------------
        // Mark Accepted
        // ------------------------------------------------------

        await pool.execute<ResultSetHeader>(
            `
            UPDATE offers

            SET
                status = 'accepted',
                updated_at = CURRENT_TIMESTAMP

            WHERE id = ?

            AND status = 'active'
            `,
            [
                id
            ]
        );

    }


    // ==========================================================
    // Expire Offers
    // ==========================================================

    static async expireOffers(): Promise<number> {

        const [result] =
            await pool.execute<ResultSetHeader>(
                `
                UPDATE offers

                SET
                    status = 'expired',
                    updated_at = CURRENT_TIMESTAMP

                WHERE status = 'active'

                AND expires_at IS NOT NULL

                AND expires_at <= CURRENT_TIMESTAMP
                `
            );

        return result.affectedRows;

    }

}
