import { body, param } from "express-validator";

export const createCollectionValidator = [

    body("contract_address").isEthereumAddress(),

    body("creator").isEthereumAddress(),

    body("name").notEmpty(),

    body("slug").notEmpty()

];

export const getCollectionValidator = [

    param("id").isInt({ min: 1 })

];

export const getCollectionSlugValidator = [

    param("slug").notEmpty()

];

export const updateCollectionValidator = [

    param("id").isInt({ min: 1 }),

    body("name").optional().notEmpty(),

    body("royalty").optional().isFloat({ min: 0, max: 100 })

];

export const deleteCollectionValidator = [

    param("id").isInt({ min: 1 })

];

import { query } from "express-validator";

export const getCollectionsValidator = [

    query("page")
        .optional()
        .isInt({ min: 1 }),

    query("limit")
        .optional()
        .isInt({
            min: 1,
            max: 100
        }),

    query("verified")
        .optional()
        .isBoolean(),

    query("search")
        .optional()
        .isString()

];