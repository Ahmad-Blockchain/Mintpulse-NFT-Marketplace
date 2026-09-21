import { Request, Response } from "express";
import { SearchService } from "../services/search.service.js";

export class SearchController {
    static async search(req: Request, res: Response) {
        try {
            const q = String(req.query.q || "");
            const data = await SearchService.searchAll(q);
            res.json({ success: true, data });
        } catch (err: any) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}
