import { validationResult } from "express-validator";
export function validationMiddleware(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation Failed",
            errors: errors.array()
        });
    }
    next();
}
//# sourceMappingURL=validation.middleware.js.map