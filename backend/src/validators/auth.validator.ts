import { body } from "express-validator";

export const nonceValidator = [

    body("wallet")
        .trim()
        .notEmpty()
        .withMessage("Wallet address is required")
        .isEthereumAddress()
        .withMessage("Invalid wallet address")

];

export const loginValidator = [

    body("wallet")
        .trim()
        .notEmpty()
        .withMessage("Wallet address is required")
        .isEthereumAddress()
        .withMessage("Invalid wallet address"),

    body("signature")
        .trim()
        .notEmpty()
        .withMessage("Signature is required")

];

export const verifySignatureValidator = [

    body("wallet")
        .trim()
        .isEthereumAddress()
        .withMessage("Invalid wallet"),

    body("signature")
        .trim()
        .notEmpty()
        .withMessage("Signature is required")

];
