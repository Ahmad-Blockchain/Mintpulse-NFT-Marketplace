import { AppError } from "../errors/AppError.js";
export function errorHandler(err, _req, res, _next) {
    console.error(err);
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
}
//# sourceMappingURL=errorHandler.js.map