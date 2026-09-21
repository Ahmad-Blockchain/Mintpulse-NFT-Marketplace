import { Request, Response, NextFunction } from "express";

export function rateLimit(req: Request, res: Response, next: NextFunction) {
    // Basic rate-limiting stub
    next();
}
