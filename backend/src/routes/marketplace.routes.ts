import { Router } from "express";
import { MarketplaceController } from "../controllers/marketplace.controller.js";

const router = Router();

router.get(
    "/listings",
    MarketplaceController.getListings
);

export default router;