// ==========================================================
// MintPulse Auction Validators
// ==========================================================

import {
    Request,
    Response,
    NextFunction
} from "express";

// ==========================================================
// Create Auction Validator
// ==========================================================

export const createAuctionValidator = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    const {
        nft_id,
        start_price,
        reserve_price,
        buy_now_price,
        payment_token,
        start_time,
        end_time
    } = req.body;

    // ------------------------------------------------------
    // NFT ID
    // ------------------------------------------------------

    if (
        nft_id === undefined ||
        !Number.isInteger(Number(nft_id)) ||
        Number(nft_id) <= 0
    ) {

        res.status(400).json({
            success: false,
            message: "Valid nft_id is required"
        });

        return;
    }

    // ------------------------------------------------------
    // Start Price
    // ------------------------------------------------------

    if (
        start_price === undefined ||
        start_price === null ||
        Number.isNaN(Number(start_price)) ||
        Number(start_price) <= 0
    ) {

        res.status(400).json({
            success: false,
            message: "Start price must be greater than zero"
        });

        return;
    }

    // ------------------------------------------------------
    // Reserve Price
    // ------------------------------------------------------

    if (
        reserve_price !== undefined &&
        reserve_price !== null
    ) {

        if (
            Number.isNaN(Number(reserve_price)) ||
            Number(reserve_price) <= 0
        ) {

            res.status(400).json({
                success: false,
                message: "Invalid reserve price"
            });

            return;
        }

        if (
            Number(reserve_price) <
            Number(start_price)
        ) {

            res.status(400).json({
                success: false,
                message:
                    "Reserve price cannot be lower than start price"
            });

            return;
        }
    }

    // ------------------------------------------------------
    // Buy Now Price
    // ------------------------------------------------------

    if (
        buy_now_price !== undefined &&
        buy_now_price !== null
    ) {

        if (
            Number.isNaN(Number(buy_now_price)) ||
            Number(buy_now_price) <= 0
        ) {

            res.status(400).json({
                success: false,
                message: "Invalid buy now price"
            });

            return;
        }

        if (
            Number(buy_now_price) <
            Number(start_price)
        ) {

            res.status(400).json({
                success: false,
                message:
                    "Buy now price cannot be lower than start price"
            });

            return;
        }
    }

    // ------------------------------------------------------
    // Payment Token
    // ------------------------------------------------------

    if (
        typeof payment_token !== "string" ||
        payment_token.trim().length === 0
    ) {

        res.status(400).json({
            success: false,
            message: "Payment token is required"
        });

        return;
    }

    // ------------------------------------------------------
    // Start Time
    // ------------------------------------------------------

    const startDate =
        new Date(start_time);

    if (
        !start_time ||
        Number.isNaN(startDate.getTime())
    ) {

        res.status(400).json({
            success: false,
            message: "Valid start_time is required"
        });

        return;
    }

    // ------------------------------------------------------
    // End Time
    // ------------------------------------------------------

    const endDate =
        new Date(end_time);

    if (
        !end_time ||
        Number.isNaN(endDate.getTime())
    ) {

        res.status(400).json({
            success: false,
            message: "Valid end_time is required"
        });

        return;
    }

    if (endDate <= startDate) {

        res.status(400).json({
            success: false,
            message:
                "end_time must be after start_time"
        });

        return;
    }

    next();
};

// ==========================================================
// Update Auction Validator
// ==========================================================

export const updateAuctionValidator = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    const {
        reserve_price,
        buy_now_price,
        start_time,
        end_time
    } = req.body;

    if (
        reserve_price === undefined &&
        buy_now_price === undefined &&
        start_time === undefined &&
        end_time === undefined
    ) {

        res.status(400).json({
            success: false,
            message:
                "At least one field is required for update"
        });

        return;
    }

    if (
        reserve_price !== undefined &&
        reserve_price !== null &&
        (
            Number.isNaN(Number(reserve_price)) ||
            Number(reserve_price) <= 0
        )
    ) {

        res.status(400).json({
            success: false,
            message: "Invalid reserve price"
        });

        return;
    }

    if (
        buy_now_price !== undefined &&
        buy_now_price !== null &&
        (
            Number.isNaN(Number(buy_now_price)) ||
            Number(buy_now_price) <= 0
        )
    ) {

        res.status(400).json({
            success: false,
            message: "Invalid buy now price"
        });

        return;
    }

    if (start_time !== undefined) {

        const date =
            new Date(start_time);

        if (Number.isNaN(date.getTime())) {

            res.status(400).json({
                success: false,
                message: "Invalid start_time"
            });

            return;
        }
    }

    if (end_time !== undefined) {

        const date =
            new Date(end_time);

        if (Number.isNaN(date.getTime())) {

            res.status(400).json({
                success: false,
                message: "Invalid end_time"
            });

            return;
        }
    }

    if (
        start_time !== undefined &&
        end_time !== undefined
    ) {

        const startDate =
            new Date(start_time);

        const endDate =
            new Date(end_time);

        if (endDate <= startDate) {

            res.status(400).json({
                success: false,
                message:
                    "end_time must be after start_time"
            });

            return;
        }
    }

    next();
};

// ==========================================================
// ID Validator
// ==========================================================

export const auctionIdValidator = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    const id =
        Number(req.params.id);

    if (
        !Number.isInteger(id) ||
        id <= 0
    ) {

        res.status(400).json({
            success: false,
            message: "Invalid auction ID"
        });

        return;
    }

    next();
};

// ==========================================================
// NFT ID Validator
// ==========================================================

export const auctionNFTIdValidator = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    const nftId =
        Number(req.params.nftId);

    if (
        !Number.isInteger(nftId) ||
        nftId <= 0
    ) {

        res.status(400).json({
            success: false,
            message: "Invalid NFT ID"
        });

        return;
    }

    next();
};