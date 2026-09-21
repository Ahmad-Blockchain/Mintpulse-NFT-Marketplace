import crypto from "crypto";
import { ethers } from "ethers";
import { JwtUtil } from "../utils/jwt.js";
import { UserService } from "./user.service.js";
export class AuthService {
    // ==========================================================
    // Generate Secure Nonce
    // ==========================================================
    static generateNonce() {
        return crypto
            .randomBytes(32)
            .toString("hex");
    }
    // ==========================================================
    // Build Wallet Sign Message
    // ==========================================================
    static buildSignMessage(wallet, nonce) {
        return `Welcome to MintPulse NFT Marketplace

Wallet:
${wallet}

Nonce:
${nonce}

By signing this message you are proving ownership of this wallet.

This request will not trigger a blockchain transaction.`;
    }
    // ==========================================================
    // Verify Wallet Signature
    // ==========================================================
    static verifySignature(wallet, nonce, signature) {
        const message = this.buildSignMessage(wallet, nonce);
        const recoveredWallet = ethers.verifyMessage(message, signature);
        return (recoveredWallet.toLowerCase()
            ===
                wallet.toLowerCase());
    }
    // ==========================================================
    // Login
    // ==========================================================
    static async login(wallet, signature) {
        const user = await UserService.getUserByWallet(wallet);
        if (!user) {
            throw new Error("User not found");
        }
        const nonce = await UserService.getNonce(wallet);
        if (!nonce) {
            throw new Error("Nonce not found");
        }
        const verified = this.verifySignature(wallet, nonce, signature);
        if (!verified) {
            throw new Error("Invalid wallet signature");
        }
        const token = JwtUtil.generateToken(wallet);
        const newNonce = this.generateNonce();
        await UserService.updateNonce(wallet, newNonce);
        return {
            accessToken: token,
            tokenType: "Bearer",
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
            user
        };
    }
}
//# sourceMappingURL=auth.service.js.map