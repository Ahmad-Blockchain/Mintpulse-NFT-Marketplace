// ==========================================================
// MintPulse Transaction Controller
// ==========================================================
import { TransactionService } from "../services/transaction.service.js";
// ==========================================================
// Request Parameter Helper
// ==========================================================
function getStringParam(value, parameterName) {
    if (typeof value !== "string" || !value.trim()) {
        throw new Error(`Invalid ${parameterName} parameter`);
    }
    return value.trim();
}
// ==========================================================
// Positive Integer Query Helper
// ==========================================================
function getOptionalPositiveInteger(value) {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value !== "string") {
        return undefined;
    }
    if (!/^\d+$/.test(value)) {
        return undefined;
    }
    const parsed = Number(value);
    return Number.isSafeInteger(parsed) &&
        parsed > 0
        ? parsed
        : undefined;
}
// ==========================================================
// Non-Negative Integer Query Helper
// ==========================================================
function getOptionalNonNegativeInteger(value) {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value !== "string") {
        return undefined;
    }
    if (!/^\d+$/.test(value)) {
        return undefined;
    }
    const parsed = Number(value);
    return Number.isSafeInteger(parsed) &&
        parsed >= 0
        ? parsed
        : undefined;
}
// ==========================================================
// String Query Helper
// ==========================================================
function getOptionalString(value) {
    if (typeof value !== "string") {
        return undefined;
    }
    const trimmed = value.trim();
    return trimmed.length > 0
        ? trimmed
        : undefined;
}
// ==========================================================
// Get All Transactions
// ==========================================================
export async function getAllTransactions(req, res, next) {
    try {
        const sortValue = getOptionalString(req.query.sort);
        const orderValue = getOptionalString(req.query.order);
        const transactionQuery = {
            page: getOptionalPositiveInteger(req.query.page),
            limit: getOptionalPositiveInteger(req.query.limit),
            tx_hash: getOptionalString(req.query.tx_hash),
            token_id: getOptionalNonNegativeInteger(req.query.token_id),
            buyer: getOptionalString(req.query.buyer),
            seller: getOptionalString(req.query.seller),
            event_type: getOptionalString(req.query.event_type),
            sort: sortValue === "created_at" ||
                sortValue === "price" ||
                sortValue === "token_id"
                ? sortValue
                : undefined,
            order: orderValue === "ASC"
                ? "ASC"
                : orderValue === "DESC"
                    ? "DESC"
                    : undefined
        };
        const transactions = await TransactionService.getAllTransactions(transactionQuery);
        res.status(200).json({
            success: true,
            data: transactions
        });
    }
    catch (error) {
        next(error);
    }
}
// ==========================================================
// Get Transaction By ID
// ==========================================================
export async function getTransactionById(req, res, next) {
    try {
        const id = Number(getStringParam(req.params.id, "id"));
        const transaction = await TransactionService.getTransactionById(id);
        if (!transaction) {
            res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: transaction
        });
    }
    catch (error) {
        next(error);
    }
}
// ==========================================================
// Get Transaction By Hash
// ==========================================================
export async function getTransactionByHash(req, res, next) {
    try {
        const txHash = getStringParam(req.params.txHash, "transaction hash");
        const transaction = await TransactionService.getTransactionByHash(txHash);
        if (!transaction) {
            res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: transaction
        });
    }
    catch (error) {
        next(error);
    }
}
// ==========================================================
// Get Transactions By Token
// ==========================================================
export async function getTransactionsByToken(req, res, next) {
    try {
        const tokenId = Number(getStringParam(req.params.tokenId, "token ID"));
        const transactions = await TransactionService.getTransactionsByToken(tokenId);
        res.status(200).json({
            success: true,
            data: transactions
        });
    }
    catch (error) {
        next(error);
    }
}
// ==========================================================
// Get Transactions By Buyer
// ==========================================================
export async function getTransactionsByBuyer(req, res, next) {
    try {
        const buyer = getStringParam(req.params.buyer, "buyer");
        const transactions = await TransactionService.getTransactionsByBuyer(buyer);
        res.status(200).json({
            success: true,
            data: transactions
        });
    }
    catch (error) {
        next(error);
    }
}
// ==========================================================
// Get Transactions By Seller
// ==========================================================
export async function getTransactionsBySeller(req, res, next) {
    try {
        const seller = getStringParam(req.params.seller, "seller");
        const transactions = await TransactionService.getTransactionsBySeller(seller);
        res.status(200).json({
            success: true,
            data: transactions
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=transaction.controller.js.map