import { MarketplaceService } from "../services/marketplace.service.js";
export class MarketplaceController {
    static async getListings(req, res) {
        try {
            const listings = await MarketplaceService.getActiveListings();
            res.json({
                success: true,
                count: listings.length,
                data: listings
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}
//# sourceMappingURL=marketplace.controller.js.map