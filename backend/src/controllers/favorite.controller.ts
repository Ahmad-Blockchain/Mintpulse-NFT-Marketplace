import { Request, Response } from "express";
import { FavoriteService } from "../services/favorite.service.js";

export class FavoriteController {
    static async toggleFavorite(req: Request, res: Response) {
        try {
            const { contract, tokenId } = req.body;
            const walletAddress = (req as any).user?.walletAddress || "0x000";
            const data = await FavoriteService.toggleFavorite(walletAddress, contract, tokenId);
            res.json({ success: true, data });
        } catch (err: any) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}
