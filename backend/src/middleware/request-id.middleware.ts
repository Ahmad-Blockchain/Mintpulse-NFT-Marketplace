import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export function requestId(req: Request, res: Response, next: NextFunction) {
    const id = req.header("X-Request-Id") || uuidv4();
    res.setHeader("X-Request-Id", id);
    next();
}
