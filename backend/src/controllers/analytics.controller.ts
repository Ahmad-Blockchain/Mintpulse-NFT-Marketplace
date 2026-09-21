import { Request, Response } from "express";
import { AnalyticsService } from "../services/analytics.service.js";

export class AnalyticsController {
    static async getStats(req: Request, res: Response) {
        try {
            const data = await AnalyticsService.getPlatformStats();
            res.json({ success: true, data });
        } catch (err: any) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}
