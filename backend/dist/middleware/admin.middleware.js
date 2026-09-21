import { ApiResponse } from "../utils/apiResponse.js";
export function requireAdmin(req, res, next) {
    if (!req.user?.wallet) {
        return ApiResponse.error(res, 401, "Authentication required");
    }
    const adminWallet = process.env.ADMIN_WALLET?.trim().toLowerCase();
    if (!adminWallet) {
        console.error("ADMIN_WALLET environment variable is not configured");
        return ApiResponse.error(res, 500, "Admin configuration is missing");
    }
    const wallet = req.user.wallet.trim().toLowerCase();
    if (wallet !== adminWallet) {
        return ApiResponse.error(res, 403, "Admin access required");
    }
    next();
}
//# sourceMappingURL=admin.middleware.js.map