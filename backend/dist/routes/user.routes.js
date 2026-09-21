import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { createUserValidator, walletValidator } from "../validators/user.validator.js";
import { validationMiddleware } from "../middleware/validation.middleware.js";
const router = Router();
// ==========================================================
// Create User
// ==========================================================
router.post("/", createUserValidator, validationMiddleware, UserController.createUser);
// ==========================================================
// Get All Users
// ==========================================================
router.get("/", UserController.getUsers);
// ==========================================================
// Get Single User
// ==========================================================
router.get("/:wallet", walletValidator, validationMiddleware, UserController.getUser);
// ==========================================================
// Update User
// ==========================================================
router.put("/:wallet", walletValidator, validationMiddleware, UserController.updateUser);
// ==========================================================
// Delete User
// ==========================================================
router.delete("/:wallet", walletValidator, validationMiddleware, UserController.deleteUser);
export default router;
//# sourceMappingURL=user.routes.js.map