import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { AdminService } from "../services/admin.service.js";
export class AdminController {
    // ======================================================
    // Get Users
    // ======================================================
    static getUsers = asyncHandler(async (req, res) => {
        const query = req.query;
        const result = await AdminService.getUsers(query);
        return ApiResponse.success(res, "Admin users fetched successfully", result);
    });
    // ======================================================
    // Get User
    // ======================================================
    static getUser = asyncHandler(async (req, res) => {
        const wallet = String(req.params.wallet);
        const user = await AdminService.getUserByWallet(wallet);
        if (!user) {
            return ApiResponse.error(res, 404, "User not found");
        }
        return ApiResponse.success(res, "User fetched successfully", user);
    });
}
//# sourceMappingURL=admin.controller.js.map