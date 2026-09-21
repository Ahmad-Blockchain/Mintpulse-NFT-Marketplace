import { Router } from "express";
import { FavoriteController } from "../controllers/favorite.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();
router.post("/toggle", authenticateToken, FavoriteController.toggleFavorite);
export default router;
