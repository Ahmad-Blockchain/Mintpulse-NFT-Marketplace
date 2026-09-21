import {

    body,

    param

} from "express-validator";

// ==========================================================
// Create Listing
// ==========================================================

export const createListingValidator = [

    body("nft_id")

        .isInt({

            min: 1

        })

        .withMessage(

            "NFT ID must be a valid positive integer"

        ),

    body("price")

        .isFloat({

            gt: 0

        })

        .withMessage(

            "Price must be greater than zero"

        ),

    body("payment_token")

        .isEthereumAddress()

        .withMessage(

            "Invalid payment token address"

        ),

    body("listing_type")

        .optional()

        .isIn([

            "fixed",

            "auction"

        ])

        .withMessage(

            "Invalid listing type"

        ),

    body("expires_at")

        .optional()

        .isISO8601()

        .withMessage(

            "Invalid expiration date"

        )

];

// ==========================================================
// Listing ID
// ==========================================================

export const listingIdValidator = [

    param("id")

        .isInt({

            min: 1

        })

        .withMessage(

            "Invalid listing ID"

        )

];

// ==========================================================
// Update Listing
// ==========================================================

export const updateListingValidator = [

    param("id")

        .isInt({

            min: 1

        })

        .withMessage(

            "Invalid listing ID"

        ),

    body("price")

        .optional()

        .isFloat({

            gt: 0

        })

        .withMessage(

            "Price must be greater than zero"

        ),

    body("payment_token")

        .optional()

        .isEthereumAddress()

        .withMessage(

            "Invalid payment token address"

        ),

    body("expires_at")

        .optional({

            nullable: true

        })

        .isISO8601()

        .withMessage(

            "Invalid expiration date"

        )

];