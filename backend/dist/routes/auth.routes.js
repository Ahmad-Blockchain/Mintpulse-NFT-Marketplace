import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { nonceValidator, verifySignatureValidator, loginValidator } from "../validators/auth.validator.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
const router = Router();
router.post("/nonce", nonceValidator, validate, AuthController.getNonce);
router.post("/verify", verifySignatureValidator, validate, AuthController.verifySignature);
router.post("/login", loginValidator, validate, AuthController.login);
router.get("/me", authenticate, AuthController.me);
export default router;
//# sourceMappingURL=auth.routes.js.map