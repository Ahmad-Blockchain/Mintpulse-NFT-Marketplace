// ==========================================================
// MintPulse Auction Routes
// ==========================================================

import { Router } from "express";

import { AuctionController } from "../controllers/auction.controller.js";

import {
    createAuctionValidator,
    updateAuctionValidator,
    auctionIdValidator,
    auctionNFTIdValidator,
    placeBidValidator,
    auctionQueryValidator
} from "../validators/auction.validator.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// ==========================================================
// Public Routes
// ==========================================================

// Get all auctions
router.get(
    "/",
    auctionQueryValidator,
    AuctionController.getAllAuctions
);

// Get active auctions
router.get(
    "/active",
    AuctionController.getActiveAuctions
);

// Get auctions by NFT
router.get(
    "/nft/:nftId",
    auctionNFTIdValidator,
    AuctionController.getAuctionsByNFT
);

// Get auction by ID
router.get(
    "/:id",
    auctionIdValidator,
    AuctionController.getAuction
);

// ==========================================================
// Protected Routes
// ==========================================================

// Create auction
router.post(
    "/",
    authenticate,
    createAuctionValidator,
    AuctionController.createAuction
);

// Update auction
router.patch(
    "/:id",
    authenticate,
    updateAuctionValidator,
    AuctionController.updateAuction
);

// Cancel auction
router.patch(
    "/:id/cancel",
    authenticate,
    auctionIdValidator,
    AuctionController.cancelAuction
);

// End auction
router.patch(
    "/:id/end",
    authenticate,
    auctionIdValidator,
    AuctionController.endAuction
);

// Place bid
router.post(
    "/:id/bids",
    authenticate,
    placeBidValidator,
    AuctionController.placeBid
);

export default router;
