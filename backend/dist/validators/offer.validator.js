import { body, param, query } from "express-validator";
// ==========================================================
// Create Offer Validator
// ==========================================================
export const createOfferValidator = [
    body("nft_id")
        .notEmpty()
        .withMessage("NFT ID is required")
        .isInt({
        min: 1
    })
        .withMessage("NFT ID must be a positive integer"),
    body("offered_price")
        .notEmpty()
        .withMessage("Offered price is required")
        .isFloat({
        gt: 0
    })
        .withMessage("Offered price must be greater than zero"),
    body("payment_token")
        .trim()
        .notEmpty()
        .withMessage("Payment token is required")
        .isEthereumAddress()
        .withMessage("Invalid payment token address"),
    body("expires_at")
        .optional({
        nullable: true
    })
        .isISO8601()
        .withMessage("Invalid expiration date")
];
// ==========================================================
// Update Offer Validator
// ==========================================================
export const updateOfferValidator = [
    param("id")
        .isInt({
        min: 1
    })
        .withMessage("Invalid offer ID"),
    body("offered_price")
        .optional()
        .isFloat({
        gt: 0
    })
        .withMessage("Offered price must be greater than zero"),
    body("payment_token")
        .optional()
        .trim()
        .isEthereumAddress()
        .withMessage("Invalid payment token address"),
    body("expires_at")
        .optional({
        nullable: true
    })
        .isISO8601()
        .withMessage("Invalid expiration date")
];
// ==========================================================
// Offer ID Validator
// ==========================================================
export const offerIdValidator = [
    param("id")
        .isInt({
        min: 1
    })
        .withMessage("Invalid offer ID")
];
// ==========================================================
// NFT Offer Validator
// ==========================================================
export const nftOfferValidator = [
    param("nftId")
        .isInt({
        min: 1
    })
        .withMessage("Invalid NFT ID")
];
// ==========================================================
// Offer Query Validator
// ==========================================================
export const offerQueryValidator = [
    query("page")
        .optional()
        .isInt({
        min: 1
    })
        .withMessage("Page must be a positive integer"),
    query("limit")
        .optional()
        .isInt({
        min: 1,
        max: 100
    })
        .withMessage("Limit must be between 1 and 100"),
    query("nft_id")
        .optional()
        .isInt({
        min: 1
    })
        .withMessage("Invalid NFT ID"),
    query("buyer")
        .optional()
        .isEthereumAddress()
        .withMessage("Invalid buyer address"),
    query("status")
        .optional()
        .isIn([
        "active",
        "accepted",
        "cancelled",
        "expired",
        "rejected"
    ])
        .withMessage("Invalid offer status"),
    query("min_price")
        .optional()
        .isFloat({
        min: 0
    })
        .withMessage("Invalid minimum price"),
    query("max_price")
        .optional()
        .isFloat({
        min: 0
    })
        .withMessage("Invalid maximum price"),
    query("sort")
        .optional()
        .isIn([
        "offered_price",
        "created_at",
        "expires_at"
    ])
        .withMessage("Invalid sort field"),
    query("order")
        .optional()
        .isIn([
        "ASC",
        "DESC"
    ])
        .withMessage("Order must be ASC or DESC")
];
//# sourceMappingURL=offer.validator.js.map