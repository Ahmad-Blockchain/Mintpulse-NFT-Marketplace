// ==========================================================
// MintPulse Auction Routes
// ==========================================================
import { Router } from "express";
import { AuctionController } from "../controllers/auction.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { createAuctionValidator, updateAuctionValidator, auctionIdValidator, auctionNFTIdValidator } from "../validators/auction.validator.js";
const router = Router();
// ==========================================================
// Public Routes
// ==========================================================
// ----------------------------------------------------------
// Get All Auctions
// ----------------------------------------------------------
router.get("/", AuctionController.getAllAuctions);
// ----------------------------------------------------------
// Get Active Auctions
// ----------------------------------------------------------
router.get("/active", AuctionController.getActiveAuctions);
// ----------------------------------------------------------
// Get Auctions By NFT
// IMPORTANT: Must come before /:id
// ----------------------------------------------------------
router.get("/nft/:nftId", auctionNFTIdValidator, AuctionController.getAuctionsByNFT);
// ----------------------------------------------------------
// Get Auction By ID
// ----------------------------------------------------------
router.get("/:id", auctionIdValidator, AuctionController.getAuction);
// ==========================================================
// Protected Routes
// ==========================================================
// ----------------------------------------------------------
// Create Auction
// ----------------------------------------------------------
router.post("/", authenticate, createAuctionValidator, AuctionController.createAuction);
// ----------------------------------------------------------
// Update Auction
// ----------------------------------------------------------
router.patch("/:id", authenticate, auctionIdValidator, updateAuctionValidator, AuctionController.updateAuction);
// ----------------------------------------------------------
// Cancel Auction
// ----------------------------------------------------------
router.patch("/:id/cancel", authenticate, auctionIdValidator, AuctionController.cancelAuction);
// ----------------------------------------------------------
// End Auction
// ----------------------------------------------------------
router.patch("/:id/end", authenticate, auctionIdValidator, AuctionController.endAuction);
export default router;
//# sourceMappingURL=bid.routes.js.map