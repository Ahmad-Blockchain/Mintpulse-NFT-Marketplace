import jwt, { SignOptions } from "jsonwebtoken";

export interface JwtPayload {
    wallet: string;
}

export class JwtUtil {

    // ==========================================================
    // Generate JWT
    // ==========================================================

    static generateToken(wallet: string): string {

        const options: SignOptions = {
            expiresIn: "7d"
        };

        return jwt.sign(
            {
                wallet
            },
            process.env.JWT_SECRET!,
            options
        );

    }

    // ==========================================================
    // Verify JWT
    // ==========================================================

    static verifyToken(token: string): JwtPayload {

        return jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload;

    }

}