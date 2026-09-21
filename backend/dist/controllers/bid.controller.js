// ==========================================================
// MintPulse Auction Controller
// ==========================================================
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { AuctionService } from "../services/auction.service.js";
export class AuctionController {
    // ======================================================
    // Create Auction
    // ======================================================
    static createAuction = asyncHandler(async (req, res) => {
        const seller = req.user.wallet;
        const auctionId = await AuctionService.createAuction(seller, req.body);
        return ApiResponse.success(res, "Auction created successfully", {
            id: auctionId
        });
    });
    // ======================================================
    // Get Auction By ID
    // ======================================================
    static getAuction = asyncHandler(async (req, res) => {
        const id = Number(req.params.id);
        const auction = await AuctionService.getAuctionById(id);
        if (!auction) {
            return ApiResponse.error(res, 404, "Auction not found");
        }
        return ApiResponse.success(res, "Auction fetched successfully", auction);
    });
    // ======================================================
    // Get All Auctions
    // ======================================================
    static getAllAuctions = asyncHandler(async (req, res) => {
        const auctions = await AuctionService.getAllAuctions(req.query);
        return ApiResponse.success(res, "Auctions fetched successfully", auctions);
    });
    // ======================================================
    // Get Active Auctions
    // ======================================================
    static getActiveAuctions = asyncHandler(async (_req, res) => {
        const auctions = await AuctionService.getActiveAuctions();
        return ApiResponse.success(res, "Active auctions fetched successfully", auctions);
    });
    // ======================================================
    // Get Auctions By NFT
    // ======================================================
    static getAuctionsByNFT = asyncHandler(async (req, res) => {
        const nftId = Number(req.params.nftId);
        const auctions = await AuctionService.getAuctionsByNFT(nftId);
        return ApiResponse.success(res, "NFT auctions fetched successfully", auctions);
    });
    // ======================================================
    // Update Auction
    // ======================================================
    static updateAuction = asyncHandler(async (req, res) => {
        const seller = req.user.wallet;
        const id = Number(req.params.id);
        await AuctionService.updateAuction(id, seller, req.body);
        return ApiResponse.success(res, "Auction updated successfully");
    });
    // ======================================================
    // Cancel Auction
    // ======================================================
    static cancelAuction = asyncHandler(async (req, res) => {
        const seller = req.user.wallet;
        const id = Number(req.params.id);
        await AuctionService.cancelAuction(id, seller);
        return ApiResponse.success(res, "Auction cancelled successfully");
    });
    // ======================================================
    // End Auction
    // ======================================================
    static endAuction = asyncHandler(async (req, res) => {
        const id = Number(req.params.id);
        await AuctionService.endAuction(id);
        return ApiResponse.success(res, "Auction ended successfully");
    });
}
//# sourceMappingURL=bid.controller.js.map