import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { NFTService } from "../services/nft.service.js";
export class NFTController {
    // ==========================================================
    // Get All NFTs
    // ==========================================================
    static getAllNFTs = asyncHandler(async (req, res) => {
        const nfts = await NFTService.getAllNFTs(req.query);
        return ApiResponse.success(res, "NFTs fetched successfully", nfts);
    });
    // ==========================================================
    // Get NFT By Token ID
    // ==========================================================
    static getNFT = asyncHandler(async (req, res) => {
        const tokenId = Number(req.params.tokenId);
        const nft = await NFTService.getNFTByTokenId(tokenId);
        if (!nft) {
            return ApiResponse.error(res, 404, "NFT not found");
        }
        return ApiResponse.success(res, "NFT fetched successfully", nft);
    });
    // ==========================================================
    // Get NFTs By Owner
    // ==========================================================
    static getNFTsByOwner = asyncHandler(async (req, res) => {
        const nfts = await NFTService.getNFTsByOwner(req.params.wallet);
        return ApiResponse.success(res, "Owner NFTs fetched successfully", nfts);
    });
    // ==========================================================
    // Get NFTs By Creator
    // ==========================================================
    static getNFTsByCreator = asyncHandler(async (req, res) => {
        const nfts = await NFTService.getNFTsByCreator(req.params.wallet);
        return ApiResponse.success(res, "Creator NFTs fetched successfully", nfts);
    });
}
//# sourceMappingURL=nft.controller.js.map