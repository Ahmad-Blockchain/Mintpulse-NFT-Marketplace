// ==========================================================
// MintPulse Transaction Validators
// ==========================================================
import { param, query } from "express-validator";
// ==========================================================
// Ethereum Address
// ==========================================================
const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
// ==========================================================
// Transaction Hash
// ==========================================================
const transactionHashRegex = /^0x[a-fA-F0-9]{64}$/;
// ==========================================================
// Get All Transactions
// ==========================================================
export const getAllTransactionsValidator = [
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
    query("tx_hash")
        .optional()
        .matches(transactionHashRegex)
        .withMessage("Invalid transaction hash"),
    query("token_id")
        .optional()
        .isInt({
        min: 0
    })
        .withMessage("Token ID must be a non-negative integer"),
    query("buyer")
        .optional()
        .matches(ethereumAddressRegex)
        .withMessage("Invalid buyer address"),
    query("seller")
        .optional()
        .matches(ethereumAddressRegex)
        .withMessage("Invalid seller address"),
    query("event_type")
        .optional()
        .isString()
        .trim()
        .isLength({
        min: 1,
        max: 50
    })
        .withMessage("Invalid event type"),
    query("sort")
        .optional()
        .isIn([
        "created_at",
        "price",
        "token_id"
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
// ==========================================================
// ID Validator
// ==========================================================
export const transactionIdValidator = [
    param("id")
        .isInt({
        min: 1
    })
        .withMessage("Transaction ID must be a positive integer")
];
// ==========================================================
// Transaction Hash Validator
// ==========================================================
export const transactionHashValidator = [
    param("txHash")
        .matches(transactionHashRegex)
        .withMessage("Invalid transaction hash")
];
// ==========================================================
// Token ID Validator
// ==========================================================
export const transactionTokenValidator = [
    param("tokenId")
        .isInt({
        min: 0
    })
        .withMessage("Token ID must be a non-negative integer")
];
// ==========================================================
// Buyer Validator
// ==========================================================
export const transactionBuyerValidator = [
    param("buyer")
        .matches(ethereumAddressRegex)
        .withMessage("Invalid buyer address")
];
// ==========================================================
// Seller Validator
// ==========================================================
export const transactionSellerValidator = [
    param("seller")
        .matches(ethereumAddressRegex)
        .withMessage("Invalid seller address")
];
//# sourceMappingURL=transaction.validator.js.map