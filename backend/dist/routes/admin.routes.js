import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
import { AdminController } from "../controllers/admin.controller.js";
const router = Router();
// ==========================================================
// Admin Authentication
// ==========================================================
router.use(authenticate);
router.use(requireAdmin);
// ==========================================================
// Users
// ==========================================================
router.get("/users", AdminController.getUsers);
router.get("/users/:wallet", AdminController.getUser);
export default router;
//# sourceMappingURL=admin.routes.js.map