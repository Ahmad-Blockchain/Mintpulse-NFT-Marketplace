import { Request, Response, NextFunction } from "express";
import { JwtUtil } from "../utils/jwt.js";
import { ApiResponse } from "../utils/apiResponse.js";

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return ApiResponse.error(res, 401, "Authentication required");
    }
    try {
        const token = authorization.replace("Bearer ", "");
        const payload = JwtUtil.verifyToken(token);
        (req as any).user = { wallet: payload.wallet };
        next();
    } catch {
        return ApiResponse.error(res, 401, "Invalid token");
    }
}

export const authenticateToken = authenticate;