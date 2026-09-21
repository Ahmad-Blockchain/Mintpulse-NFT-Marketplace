import { Router } from "express";
import { OfferController } from "../controllers/offer.controller.js";
import { createOfferValidator, updateOfferValidator, offerIdValidator, nftOfferValidator, offerQueryValidator } from "../validators/offer.validator.js";
import { validate } from "../middleware/validate.js";
import { authenticate as authMiddleware } from "../middleware/auth.middleware.js";
const router = Router();
// ==========================================================
// Public Routes
// ==========================================================
// Get all offers
router.get("/", offerQueryValidator, validate, OfferController.getAllOffers);
// Get offers for specific NFT
router.get("/nft/:nftId", nftOfferValidator, validate, OfferController.getNFTOffers);
// ==========================================================
// Protected Routes
// ==========================================================
// Get my sent offers
router.get("/me/sent", authMiddleware, OfferController.getMyOffers);
// Get offers received by me
router.get("/me/received", authMiddleware, OfferController.getReceivedOffers);
// Create offer
router.post("/", authMiddleware, createOfferValidator, validate, OfferController.createOffer);
// Get single offer
router.get("/:id", offerIdValidator, validate, OfferController.getOffer);
// Update offer
router.patch("/:id", authMiddleware, updateOfferValidator, validate, OfferController.updateOffer);
// Cancel offer
router.delete("/:id", authMiddleware, offerIdValidator, validate, OfferController.cancelOffer);
// Accept offer
router.post("/:id/accept", authMiddleware, offerIdValidator, validate, OfferController.acceptOffer);
// Reject offer
router.post("/:id/reject", authMiddleware, offerIdValidator, validate, OfferController.rejectOffer);
export default router;
//# sourceMappingURL=offer.routes.js.map