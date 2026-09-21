import { Request, Response } from "express";
import { ActivityService } from "../services/activity.service.js";

export class ActivityController {
    static async getGlobalActivities(req: Request, res: Response) {
        try {
            const data = await ActivityService.getGlobalActivities();
            res.json({ success: true, data });
        } catch (err: any) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}
