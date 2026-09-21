import { body, param } from "express-validator";
// ==========================================================
// Create User Validation
// ==========================================================
export const createUserValidator = [
    body("wallet")
        .trim()
        .notEmpty()
        .withMessage("Wallet address is required")
        .isEthereumAddress()
        .withMessage("Invalid wallet address"),
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({
        min: 3,
        max: 30
    })
        .withMessage("Username must be between 3 and 30 characters"),
    body("avatar")
        .optional()
        .isURL()
        .withMessage("Avatar must be a valid URL"),
    body("bio")
        .optional()
        .isLength({
        max: 500
    })
        .withMessage("Bio cannot exceed 500 characters")
];
// ==========================================================
// Wallet Param Validation
// ==========================================================
export const walletValidator = [
    param("wallet")
        .trim()
        .isEthereumAddress()
        .withMessage("Invalid wallet address")
];
//# sourceMappingURL=user.validator.js.map