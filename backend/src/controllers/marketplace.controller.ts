import { Request, Response } from "express";
import { MarketplaceService } from "../services/marketplace.service.js";

export class MarketplaceController {

    static async getListings(
        req: Request,
        res: Response
    ) {

        try {

            const listings =
                await MarketplaceService.getActiveListings();

            res.json({

                success: true,

                count: listings.length,

                data: listings

            });

        }

        catch (error: any) {

            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }

}