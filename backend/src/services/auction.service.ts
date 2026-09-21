// ==========================================================
// MintPulse Auction Service
// ==========================================================

import {
    RowDataPacket,
    ResultSetHeader
} from "mysql2";

import { pool } from "../config/database.js";

import {
    Auction,
    AuctionQuery,
    CreateAuctionBody,
    UpdateAuctionBody
} from "../types/auction.types.js";

import { NFTService } from "./nft.service.js";

export class AuctionService {

    // ==========================================================
    // Create Auction
    // ==========================================================

    static async createAuction(
        seller: string,
        data: CreateAuctionBody
    ): Promise<number> {

        // ------------------------------------------------------
        // Validate NFT
        // ------------------------------------------------------

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
        // Validate Ownership
        // ------------------------------------------------------

        if (
            nft.owner.toLowerCase() !==
            seller.toLowerCase()
        ) {

            throw new Error(
                "You are not the NFT owner"
            );

        }

        // ------------------------------------------------------
        // Validate Price
        // ------------------------------------------------------

        if (data.start_price <= 0) {

            throw new Error(
                "Start price must be greater than zero"
            );

        }

        if (
            data.reserve_price !== undefined &&
            data.reserve_price !== null &&
            data.reserve_price < data.start_price
        ) {

            throw new Error(
                "Reserve price cannot be lower than start price"
            );

        }

        if (
            data.buy_now_price !== undefined &&
            data.buy_now_price !== null &&
            data.buy_now_price < data.start_price
        ) {

            throw new Error(
                "Buy now price cannot be lower than start price"
            );

        }

        // ------------------------------------------------------
        // Validate Time
        // ------------------------------------------------------

        const startTime =
            new Date(data.start_time);

        const endTime =
            new Date(data.end_time);

        if (
            Number.isNaN(startTime.getTime()) ||
            Number.isNaN(endTime.getTime())
        ) {

            throw new Error(
                "Invalid auction start or end time"
            );

        }

        if (endTime <= startTime) {

            throw new Error(
                "Auction end time must be after start time"
            );

        }

        // ------------------------------------------------------
        // Determine Status
        // ------------------------------------------------------

        const now = new Date();

        const status =
            startTime > now
                ? "scheduled"
                : "active";

        // ------------------------------------------------------
        // Insert Auction
        // ------------------------------------------------------

        const [result] =
            await pool.execute<ResultSetHeader>(

                `
                INSERT INTO auctions
                (
                    nft_id,
                    seller,
                    start_price,
                    reserve_price,
                    buy_now_price,
                    payment_token,
                    highest_bid,
                    highest_bidder,
                    start_time,
                    end_time,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,

                [
                    data.nft_id,
                    seller,
                    data.start_price,
                    data.reserve_price ?? null,
                    data.buy_now_price ?? null,
                    data.payment_token,
                    0,
                    null,
                    startTime,
                    endTime,
                    status
                ]

            );

        return result.insertId;
    }

    // ==========================================================
    // Get Auction By ID
    // ==========================================================

    static async getAuctionById(
        id: number
    ): Promise<Auction | null> {

        const [rows] =
            await pool.execute<RowDataPacket[]>(

                `
                SELECT *
                FROM auctions
                WHERE id = ?
                LIMIT 1
                `,

                [id]

            );

        return rows.length
            ? rows[0] as Auction
            : null;
    }

    // ==========================================================
    // Get All Auctions
    // ==========================================================

    static async getAllAuctions(
        query: AuctionQuery
    ): Promise<Auction[]> {

        const page =
            Math.max(
                1,
                Number(query.page ?? 1)
            );

        const limit =
            Math.min(
                100,
                Math.max(
                    1,
                    Number(query.limit ?? 20)
                )
            );

        const offset =
            (page - 1) * limit;

        // ------------------------------------------------------
        // Safe Sorting
        // ------------------------------------------------------

        const allowedSort = [
            "start_price",
            "highest_bid",
            "start_time",
            "end_time",
            "created_at"
        ] as const;

        const sort =
            allowedSort.includes(
                query.sort as typeof allowedSort[number]
            )
                ? query.sort!
                : "created_at";

        const order =
            query.order === "ASC"
                ? "ASC"
                : "DESC";

        // ------------------------------------------------------
        // Base Query
        // ------------------------------------------------------

        let sql = `
            SELECT *
            FROM auctions
            WHERE 1 = 1
        `;

        const values: (
            string | number
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
        // NFT Filter
        // ------------------------------------------------------

        if (query.nft_id !== undefined) {

            sql += `
                AND nft_id = ?
            `;

            values.push(
                query.nft_id
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
        // Payment Token Filter
        // ------------------------------------------------------

        if (query.payment_token) {

            sql += `
                AND payment_token = ?
            `;

            values.push(
                query.payment_token
            );

        }

        // ------------------------------------------------------
        // Pagination
        // ------------------------------------------------------

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

        return rows as Auction[];
    }

    // ==========================================================
    // Get Active Auctions
    // ==========================================================

    static async getActiveAuctions(): Promise<Auction[]> {

        const [rows] =
            await pool.execute<RowDataPacket[]>(

                `
                SELECT *
                FROM auctions
                WHERE status = 'active'
                AND start_time <= CURRENT_TIMESTAMP
                AND end_time > CURRENT_TIMESTAMP
                ORDER BY end_time ASC
                `

            );

        return rows as Auction[];
    }

    // ==========================================================
    // Get Auctions By NFT
    // ==========================================================

    static async getAuctionsByNFT(
        nftId: number
    ): Promise<Auction[]> {

        const [rows] =
            await pool.execute<RowDataPacket[]>(

                `
                SELECT *
                FROM auctions
                WHERE nft_id = ?
                ORDER BY created_at DESC
                `,

                [nftId]

            );

        return rows as Auction[];
    }

    // ==========================================================
    // Update Auction
    // ==========================================================

    static async updateAuction(
        id: number,
        seller: string,
        data: UpdateAuctionBody
    ): Promise<void> {

        const auction =
            await this.getAuctionById(id);

        if (!auction) {

            throw new Error(
                "Auction not found"
            );

        }

        if (
            auction.seller.toLowerCase() !==
            seller.toLowerCase()
        ) {

            throw new Error(
                "You are not the auction owner"
            );

        }

        if (auction.status !== "scheduled") {

            throw new Error(
                "Only scheduled auctions can be updated"
            );

        }

        const fields: string[] = [];

        const values: (
            string | number | Date | null
        )[] = [];

        // ------------------------------------------------------
        // Reserve Price
        // ------------------------------------------------------

        if (
            data.reserve_price !== undefined
        ) {

            if (
                data.reserve_price !== null &&
                data.reserve_price < auction.start_price
            ) {

                throw new Error(
                    "Reserve price cannot be lower than start price"
                );

            }

            fields.push(
                "reserve_price = ?"
            );

            values.push(
                data.reserve_price
            );

        }

        // ------------------------------------------------------
        // Buy Now Price
        // ------------------------------------------------------

        if (
            data.buy_now_price !== undefined
        ) {

            if (
                data.buy_now_price !== null &&
                data.buy_now_price < auction.start_price
            ) {

                throw new Error(
                    "Buy now price cannot be lower than start price"
                );

            }

            fields.push(
                "buy_now_price = ?"
            );

            values.push(
                data.buy_now_price
            );

        }

        // ------------------------------------------------------
        // Start Time
        // ------------------------------------------------------

        if (
            data.start_time !== undefined
        ) {

            const startTime =
                new Date(data.start_time);

            if (
                Number.isNaN(
                    startTime.getTime()
                )
            ) {

                throw new Error(
                    "Invalid auction start time"
                );

            }

            fields.push(
                "start_time = ?"
            );

            values.push(
                startTime
            );

        }

        // ------------------------------------------------------
        // End Time
        // ------------------------------------------------------

        if (
            data.end_time !== undefined
        ) {

            const endTime =
                new Date(data.end_time);

            if (
                Number.isNaN(
                    endTime.getTime()
                )
            ) {

                throw new Error(
                    "Invalid auction end time"
                );

            }

            fields.push(
                "end_time = ?"
            );

            values.push(
                endTime
            );

        }

        // ------------------------------------------------------
        // No Changes
        // ------------------------------------------------------

        if (fields.length === 0) {

            throw new Error(
                "No fields provided for update"
            );

        }

        // ------------------------------------------------------
        // Update
        // ------------------------------------------------------

        fields.push(
            "updated_at = CURRENT_TIMESTAMP"
        );

        values.push(id);

        await pool.execute<ResultSetHeader>(

            `
            UPDATE auctions
            SET ${fields.join(", ")}
            WHERE id = ?
            AND status = 'scheduled'
            `,

            values

        );
    }

    // ==========================================================
    // Cancel Auction
    // ==========================================================

    static async cancelAuction(
        id: number,
        seller: string
    ): Promise<void> {

        const auction =
            await this.getAuctionById(id);

        if (!auction) {

            throw new Error(
                "Auction not found"
            );

        }

        if (
            auction.seller.toLowerCase() !==
            seller.toLowerCase()
        ) {

            throw new Error(
                "You are not the auction owner"
            );

        }

        if (
            auction.status !== "scheduled" &&
            auction.status !== "active"
        ) {

            throw new Error(
                "Auction cannot be cancelled"
            );

        }

        await pool.execute<ResultSetHeader>(

            `
            UPDATE auctions
            SET
                status = 'cancelled',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            `,

            [id]

        );
    }

    // ==========================================================
    // End Auction
    // ==========================================================

    static async endAuction(
        id: number
    ): Promise<void> {

        const auction =
            await this.getAuctionById(id);

        if (!auction) {

            throw new Error(
                "Auction not found"
            );

        }

        if (auction.status !== "active") {

            throw new Error(
                "Only active auctions can be ended"
            );

        }

        await pool.execute<ResultSetHeader>(

            `
            UPDATE auctions
            SET
                status = 'ended',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            `,

            [id]

        );
    }

    // ==========================================================
    // Update Highest Bid
    // ==========================================================

    static async updateHighestBid(
        id: number,
        bidder: string,
        bidAmount: number
    ): Promise<void> {

        const auction =
            await this.getAuctionById(id);

        if (!auction) {

            throw new Error(
                "Auction not found"
            );

        }

        if (auction.status !== "active") {

            throw new Error(
                "Auction is not active"
            );

        }

        if (
            bidAmount <= auction.highest_bid
        ) {

            throw new Error(
                "Bid must be higher than current highest bid"
            );

        }

        if (
            bidAmount < auction.start_price
        ) {

            throw new Error(
                "Bid must be at least the starting price"
            );

        }

        if (
            auction.end_time <= new Date()
        ) {

            throw new Error(
                "Auction has expired"
            );

        }

        await pool.execute<ResultSetHeader>(

            `
            UPDATE auctions
            SET
                highest_bid = ?,
                highest_bidder = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            AND status = 'active'
            `,

            [
                bidAmount,
                bidder,
                id
            ]

        );
    }

    // ==========================================================
    // Mark Auction As Active
    // ==========================================================

    static async activateScheduledAuctions(): Promise<void> {

        await pool.execute<ResultSetHeader>(

            `
            UPDATE auctions
            SET
                status = 'active',
                updated_at = CURRENT_TIMESTAMP
            WHERE status = 'scheduled'
            AND start_time <= CURRENT_TIMESTAMP
            AND end_time > CURRENT_TIMESTAMP
            `

        );
    }

    // ==========================================================
    // Mark Expired Auctions As Ended
    // ==========================================================

    static async expireAuctions(): Promise<void> {

        await pool.execute<ResultSetHeader>(

            `
            UPDATE auctions
            SET
                status = 'ended',
                updated_at = CURRENT_TIMESTAMP
            WHERE status = 'active'
            AND end_time <= CURRENT_TIMESTAMP
            `

        );
    }
}