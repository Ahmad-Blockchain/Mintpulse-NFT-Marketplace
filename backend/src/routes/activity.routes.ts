import { Router } from "express";
import { ActivityController } from "../controllers/activity.controller.js";

const router = Router();
router.get("/", ActivityController.getGlobalActivities);
export default router;
