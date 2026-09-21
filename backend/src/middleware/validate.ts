import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    validationResult
} from "express-validator";

export function validate(

    req: Request,

    res: Response,

    next: NextFunction

): void {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        res.status(400).json({

            success: false,

            message: "Validation Failed",

            errors: errors.array()

        });

        return;

    }

    next();

}

import { body, param } from "express-validator";

// ==========================================================
// Update Collection
// ==========================================================

export const updateCollectionValidator = [

    param("id")
        .isInt({ min: 1 }),

    body("name")
        .optional()
        .notEmpty(),

    body("royalty")
        .optional()
        .isFloat({
            min: 0,
            max: 100
        })

];

// ==========================================================
// Delete Collection
// ==========================================================

export const deleteCollectionValidator = [

    param("id")
        .isInt({ min: 1 })

];