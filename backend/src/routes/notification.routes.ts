import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", authenticateToken, NotificationController.getNotifications);
export default router;
