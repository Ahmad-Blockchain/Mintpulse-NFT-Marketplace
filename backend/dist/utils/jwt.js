import jwt from "jsonwebtoken";
export class JwtUtil {
    // ==========================================================
    // Generate JWT
    // ==========================================================
    static generateToken(wallet) {
        const options = {
            expiresIn: "7d"
        };
        return jwt.sign({
            wallet
        }, process.env.JWT_SECRET, options);
    }
    // ==========================================================
    // Verify JWT
    // ==========================================================
    static verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
}
//# sourceMappingURL=jwt.js.map