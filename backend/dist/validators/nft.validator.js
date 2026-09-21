import { param, query } from "express-validator";
// ==========================================================
// Get NFT By Token ID
// ==========================================================
export const getNFTValidator = [
    param("tokenId")
        .isInt({ min: 1 })
        .withMessage("Invalid token ID")
];
// ==========================================================
// Get NFTs By Owner
// ==========================================================
export const getNFTsByOwnerValidator = [
    param("wallet")
        .trim()
        .isEthereumAddress()
        .withMessage("Invalid wallet address")
];
// ==========================================================
// Get NFTs By Creator
// ==========================================================
export const getNFTsByCreatorValidator = [
    param("wallet")
        .trim()
        .isEthereumAddress()
        .withMessage("Invalid wallet address")
];
// ==========================================================
// Get All NFTs
// ==========================================================
export const getAllNFTsValidator = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be greater than 0"),
    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),
    query("owner")
        .optional()
        .trim()
        .isEthereumAddress()
        .withMessage("Invalid owner wallet"),
    query("creator")
        .optional()
        .trim()
        .isEthereumAddress()
        .withMessage("Invalid creator wallet"),
    query("collection")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Invalid collection id"),
    query("sort")
        .optional()
        .isIn([
        "minted_at",
        "name",
        "royalty"
    ])
        .withMessage("Invalid sort field"),
    query("order")
        .optional()
        .isIn([
        "ASC",
        "DESC"
    ])
        .withMessage("Invalid order"),
    query("search")
        .optional()
        .trim()
        .isLength({
        max: 100
    })
        .withMessage("Search is too long")
];
//# sourceMappingURL=nft.validator.js.map