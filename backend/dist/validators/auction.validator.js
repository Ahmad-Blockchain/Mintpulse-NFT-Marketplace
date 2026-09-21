// ==========================================================
// MintPulse Auction Validators
// ==========================================================
import { body, param, query } from "express-validator";
// ==========================================================
// Create Auction Validator
// ==========================================================
export const createAuctionValidator = [
    body("nft_id")
        .isInt({ min: 1 })
        .withMessage("NFT ID must be a positive integer"),
    body("start_price")
        .isFloat({ gt: 0 })
        .withMessage("Start price must be greater than zero"),
    body("reserve_price")
        .optional({
        nullable: true
    })
        .isFloat({ gt: 0 })
        .withMessage("Reserve price must be greater than zero"),
    body("buy_now_price")
        .optional({
        nullable: true
    })
        .isFloat({ gt: 0 })
        .withMessage("Buy now price must be greater than zero"),
    body("payment_token")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Payment token is required")
        .isLength({ max: 42 })
        .withMessage("Payment token address is invalid"),
    body("start_time")
        .isISO8601()
        .withMessage("Start time must be a valid ISO date"),
    body("end_time")
        .isISO8601()
        .withMessage("End time must be a valid ISO date")
];
// ==========================================================
// Update Auction Validator
// ==========================================================
export const updateAuctionValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Auction ID must be a positive integer"),
    body("reserve_price")
        .optional({
        nullable: true
    })
        .isFloat({ gt: 0 })
        .withMessage("Reserve price must be greater than zero"),
    body("buy_now_price")
        .optional({
        nullable: true
    })
        .isFloat({ gt: 0 })
        .withMessage("Buy now price must be greater than zero"),
    body("start_time")
        .optional()
        .isISO8601()
        .withMessage("Start time must be a valid ISO date"),
    body("end_time")
        .optional()
        .isISO8601()
        .withMessage("End time must be a valid ISO date")
];
// ==========================================================
// Auction ID Validator
// ==========================================================
export const auctionIdValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Auction ID must be a positive integer")
];
// ==========================================================
// NFT ID Validator
// ==========================================================
export const auctionNFTIdValidator = [
    param("nftId")
        .isInt({ min: 1 })
        .withMessage("NFT ID must be a positive integer")
];
// ==========================================================
// Place Bid Validator
// ==========================================================
export const placeBidValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Auction ID must be a positive integer"),
    body("bid_amount")
        .isFloat({ gt: 0 })
        .withMessage("Bid amount must be greater than zero")
];
// ==========================================================
// Auction Query Validator
// ==========================================================
export const auctionQueryValidator = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),
    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),
    query("nft_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("NFT ID must be a positive integer"),
    query("seller")
        .optional()
        .isString()
        .trim(),
    query("payment_token")
        .optional()
        .isString()
        .trim(),
    query("status")
        .optional()
        .isIn([
        "scheduled",
        "active",
        "ended",
        "cancelled"
    ])
        .withMessage("Invalid auction status"),
    query("sort")
        .optional()
        .isIn([
        "start_price",
        "highest_bid",
        "start_time",
        "end_time",
        "created_at"
    ])
        .withMessage("Invalid auction sort field"),
    query("order")
        .optional()
        .isIn([
        "ASC",
        "DESC"
    ])
        .withMessage("Order must be ASC or DESC")
];
//# sourceMappingURL=auction.validator.js.map