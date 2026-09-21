import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service.js";

export class NotificationController {
    static async getNotifications(req: Request, res: Response) {
        try {
            const wallet = (req as any).user?.walletAddress || "0x000";
            const data = await NotificationService.getUserNotifications(wallet);
            res.json({ success: true, data });
        } catch (err: any) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}
