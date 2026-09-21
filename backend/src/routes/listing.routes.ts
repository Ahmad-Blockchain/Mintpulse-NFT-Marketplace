import { Router } from "express";

import { ListingController } from "../controllers/listing.controller.js";

import { validate } from "../middleware/validate.js";

import { authenticate } from "../middleware/auth.middleware.js";

import {

    createListingValidator,

    listingIdValidator,

    updateListingValidator

} from "../validators/listing.validator.js";

const router = Router();

// ==========================================================
// Public Listings
// ==========================================================

router.get(

    "/",

    ListingController.getAllListings

);

// ==========================================================
// Get Listing
// ==========================================================

router.get(

    "/:id",

    listingIdValidator,

    validate,

    ListingController.getListing

);

// ==========================================================
// Protected - Create Listing
// ==========================================================

router.post(

    "/",

    authenticate,

    createListingValidator,

    validate,

    ListingController.createListing

);

// ==========================================================
// Protected - Update Listing
// ==========================================================

router.put(

    "/:id",

    authenticate,

    updateListingValidator,

    validate,

    ListingController.updateListing

);

// ==========================================================
// Protected - Cancel Listing
// ==========================================================

router.delete(

    "/:id",

    authenticate,

    listingIdValidator,

    validate,

    ListingController.cancelListing

);

export default router;