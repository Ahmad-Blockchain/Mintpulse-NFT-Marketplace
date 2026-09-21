import { Request, Response, NextFunction } from "express";

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(`[ERROR] ${req.method} ${req.url}:`, err);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || "Internal Server Error",
    });
}
