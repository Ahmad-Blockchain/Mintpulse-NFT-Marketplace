// ==========================================================
// MintPulse Transaction Routes
// ==========================================================

import { Router } from "express";

import {
    getAllTransactions,
    getTransactionById,
    getTransactionByHash,
    getTransactionsByToken,
    getTransactionsByBuyer,
    getTransactionsBySeller
} from "../controllers/transaction.controller.js";

import {
    getAllTransactionsValidator,
    transactionIdValidator,
    transactionHashValidator,
    transactionTokenValidator,
    transactionBuyerValidator,
    transactionSellerValidator
} from "../validators/transaction.validator.js";

import {
    validationMiddleware
} from "../middleware/validation.middleware.js";


// ==========================================================
// Router
// ==========================================================

const router = Router();


// ==========================================================
// Get All Transactions
// ==========================================================
// GET /api/transactions

router.get(
    "/",
    getAllTransactionsValidator,
    validationMiddleware,
    getAllTransactions
);


// ==========================================================
// Get Transaction By ID
// ==========================================================
// GET /api/transactions/id/:id

router.get(
    "/id/:id",
    transactionIdValidator,
    validationMiddleware,
    getTransactionById
);


// ==========================================================
// Get Transaction By Hash
// ==========================================================
// GET /api/transactions/hash/:txHash

router.get(
    "/hash/:txHash",
    transactionHashValidator,
    validationMiddleware,
    getTransactionByHash
);


// ==========================================================
// Get Transactions By Token
// ==========================================================
// GET /api/transactions/token/:tokenId

router.get(
    "/token/:tokenId",
    transactionTokenValidator,
    validationMiddleware,
    getTransactionsByToken
);


// ==========================================================
// Get Transactions By Buyer
// ==========================================================
// GET /api/transactions/buyer/:buyer

router.get(
    "/buyer/:buyer",
    transactionBuyerValidator,
    validationMiddleware,
    getTransactionsByBuyer
);


// ==========================================================
// Get Transactions By Seller
// ==========================================================
// GET /api/transactions/seller/:seller

router.get(
    "/seller/:seller",
    transactionSellerValidator,
    validationMiddleware,
    getTransactionsBySeller
);


// ==========================================================
// Export
// ==========================================================

export default router;