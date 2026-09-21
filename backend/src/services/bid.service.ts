// ==========================================================
// MintPulse Bid Service
// ==========================================================

import {
    RowDataPacket,
    ResultSetHeader
} from "mysql2";

import { pool } from "../config/database.js";

import {
    Bid,
    BidQuery,
    CreateBidBody
} from "../types/bid.types.js";

export class BidService {

    // ======================================================
    // Create Bid
    // ======================================================

    static async createBid(
        bidder: string,
        data: CreateBidBody
    ): Promise<number> {

        if (!bidder) {
            throw new Error("Bidder wallet is required");
        }

        if (!data.auction_id) {
            throw new Error("Auction ID is required");
        }

        if (
            data.amount === undefined ||
            data.amount <= 0
        ) {
            throw new Error(
                "Bid amount must be greater than zero"
            );
        }

        // --------------------------------------------------
        // Verify Auction
        // --------------------------------------------------

        const [auctionRows] =
            await pool.execute<RowDataPacket[]>(

                `
                SELECT
                    id,
                    seller,
                    start_price,
                    reserve_price,
                    highest_bid,
                    highest_bidder,
                    start_time,
                    end_time,
                    status

                FROM auctions

                WHERE id = ?

                LIMIT 1
                `,

                [data.auction_id]
            );

        if (auctionRows.length === 0) {
            throw new Error("Auction not found");
        }

        const auction = auctionRows[0];

        // --------------------------------------------------
        // Seller Cannot Bid
        // --------------------------------------------------

        if (
            auction.seller.toLowerCase()
            ===
            bidder.toLowerCase()
        ) {
            throw new Error(
                "Auction seller cannot place a bid"
            );
        }

        // --------------------------------------------------
        // Auction Status
        // --------------------------------------------------

        if (auction.status !== "active") {
            throw new Error(
                "Auction is not active"
            );
        }

        // --------------------------------------------------
        // Auction Time Validation
        // --------------------------------------------------

        const now = new Date();

        if (
            auction.start_time &&
            now < new Date(auction.start_time)
        ) {
            throw new Error(
                "Auction has not started yet"
            );
        }

        if (
            auction.end_time &&
            now >= new Date(auction.end_time)
        ) {
            throw new Error(
                "Auction has already ended"
            );
        }

        // --------------------------------------------------
        // Minimum Bid Validation
        // --------------------------------------------------

        const currentHighestBid =
            Number(auction.highest_bid ?? 0);

        const startPrice =
            Number(auction.start_price ?? 0);

        const minimumBid =
            Math.max(
                startPrice,
                currentHighestBid
            );

        if (data.amount <= minimumBid) {
            throw new Error(
                `Bid must be greater than ${minimumBid}`
            );
        }

        // --------------------------------------------------
        // Transaction
        // --------------------------------------------------

        const connection =
            await pool.getConnection();

        try {

            await connection.beginTransaction();

            // ----------------------------------------------
            // Insert Bid
            // ----------------------------------------------

            const [result] =
                await connection.execute<ResultSetHeader>(

                    `
                    INSERT INTO auction_bids
                    (
                        auction_id,
                        bidder,
                        amount,
                        transaction_hash,
                        block_number
                    )

                    VALUES (?, ?, ?, ?, ?)
                    `,

                    [
                        data.auction_id,
                        bidder,
                        data.amount,
                        data.transaction_hash ?? null,
                        data.block_number ?? null
                    ]
                );

            // ----------------------------------------------
            // Update Auction Highest Bid
            // ----------------------------------------------

            await connection.execute(

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
                    data.amount,
                    bidder,
                    data.auction_id
                ]
            );

            await connection.commit();

            return result.insertId;

        } catch (error) {

            await connection.rollback();

            throw error;

        } finally {

            connection.release();

        }
    }

    // ======================================================
    // Get Bid By ID
    // ======================================================

    static async getBidById(
        id: number
    ): Promise<Bid | null> {

        const [rows] =
            await pool.execute<RowDataPacket[]>(

                `
                SELECT *
                FROM auction_bids

                WHERE id = ?

                LIMIT 1
                `,

                [id]
            );

        return rows.length
            ? rows[0] as Bid
            : null;
    }

    // ======================================================
    // Get Bids By Auction
    // ======================================================

    static async getBidsByAuction(
        auctionId: number
    ): Promise<Bid[]> {

        const [rows] =
            await pool.execute<RowDataPacket[]>(

                `
                SELECT *
                FROM auction_bids

                WHERE auction_id = ?

                ORDER BY amount DESC, created_at DESC
                `,

                [auctionId]
            );

        return rows as Bid[];
    }

    // ======================================================
    // Get Bids By Bidder
    // ======================================================

    static async getBidsByBidder(
        bidder: string
    ): Promise<Bid[]> {

        const [rows] =
            await pool.execute<RowDataPacket[]>(

                `
                SELECT *
                FROM auction_bids

                WHERE bidder = ?

                ORDER BY created_at DESC
                `,

                [bidder]
            );

        return rows as Bid[];
    }

    // ======================================================
    // Get All Bids
    // ======================================================

    static async getAllBids(
        query: BidQuery
    ): Promise<Bid[]> {

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

        const order =
            query.order === "ASC"
                ? "ASC"
                : "DESC";

        let sql = `
            SELECT *
            FROM auction_bids
            WHERE 1 = 1
        `;

        const values: (
            string | number
        )[] = [];

        // --------------------------------------------------
        // Auction Filter
        // --------------------------------------------------

        if (
            query.auction_id !== undefined
        ) {

            sql += `
                AND auction_id = ?
            `;

            values.push(
                query.auction_id
            );
        }

        // --------------------------------------------------
        // Bidder Filter
        // --------------------------------------------------

        if (query.bidder) {

            sql += `
                AND bidder = ?
            `;

            values.push(
                query.bidder
            );
        }

        // --------------------------------------------------
        // Minimum Amount
        // --------------------------------------------------

        if (
            query.min_amount !== undefined
        ) {

            sql += `
                AND amount >= ?
            `;

            values.push(
                query.min_amount
            );
        }

        // --------------------------------------------------
        // Maximum Amount
        // --------------------------------------------------

        if (
            query.max_amount !== undefined
        ) {

            sql += `
                AND amount <= ?
            `;

            values.push(
                query.max_amount
            );
        }

        sql += `
            ORDER BY amount ${order}, created_at DESC
            LIMIT ${limit}
            OFFSET ${offset}
        `;

        const [rows] =
            await pool.execute<RowDataPacket[]>(
                sql,
                values
            );

        return rows as Bid[];
    }

    // ======================================================
    // Get Highest Bid
    // ======================================================

    static async getHighestBid(
        auctionId: number
    ): Promise<Bid | null> {

        const [rows] =
            await pool.execute<RowDataPacket[]>(

                `
                SELECT *
                FROM auction_bids

                WHERE auction_id = ?

                ORDER BY amount DESC

                LIMIT 1
                `,

                [auctionId]
            );

        return rows.length
            ? rows[0] as Bid
            : null;
    }

}