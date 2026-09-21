import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { AuthService } from "../services/auth.service.js";
import { UserService } from "../services/user.service.js";
export class AuthController {
    // ==========================================================
    // Generate Nonce
    // ==========================================================
    static getNonce = asyncHandler(async (req, res) => {
        const { wallet } = req.body;
        const user = await UserService.getUserByWallet(wallet);
        if (!user) {
            return ApiResponse.error(res, 404, "User not found");
        }
        const nonce = AuthService.generateNonce();
        await UserService.updateNonce(wallet, nonce);
        return ApiResponse.success(res, "Nonce generated", {
            wallet,
            nonce
        });
    });
    // ==========================================================
    // Verify Wallet Signature
    // ==========================================================
    static verifySignature = asyncHandler(async (req, res) => {
        const { wallet, signature } = req.body;
        const nonce = await UserService.getNonce(wallet);
        if (!nonce) {
            return ApiResponse.error(res, 404, "Nonce not found");
        }
        const verified = AuthService.verifySignature(wallet, nonce, signature);
        if (!verified) {
            return ApiResponse.error(res, 401, "Invalid wallet signature");
        }
        return ApiResponse.success(res, "Wallet signature verified");
    });
    // ==========================================================
    // Login
    // ==========================================================
    static login = asyncHandler(async (req, res) => {
        const { wallet, signature } = req.body;
        const result = await AuthService.login(wallet, signature);
        return ApiResponse.success(res, "Login successful", result);
    });
    // ==========================================================
    // Current User
    // ==========================================================
    static me = asyncHandler(async (req, res) => {
        const wallet = req.user.wallet;
        const user = await UserService.getUserByWallet(wallet);
        if (!user) {
            return ApiResponse.error(res, 404, "User not found");
        }
        return ApiResponse.success(res, "Current user", user);
    });
}
//# sourceMappingURL=auth.controller.js.map