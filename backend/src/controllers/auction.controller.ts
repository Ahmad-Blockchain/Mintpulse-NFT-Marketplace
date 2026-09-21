// ==========================================================
// MintPulse Auction Controller
// ==========================================================

import {
    Request,
    Response
} from "express";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

import { AuctionService } from "../services/auction.service.js";

import {
    AuctionQuery
} from "../types/auction.types.js";

export class AuctionController {

    // ==========================================================
    // Create Auction
    // ==========================================================

    static createAuction = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const seller =
                req.user!.wallet;

            const id =
                await AuctionService.createAuction(
                    seller,
                    req.body
                );

            return ApiResponse.success(
                res,
                "Auction created successfully",
                {
                    id
                }
            );
        }

    );

    // ==========================================================
    // Get Auction By ID
    // ==========================================================

    static getAuction = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const id =
                Number(req.params.id);

            const auction =
                await AuctionService.getAuctionById(
                    id
                );

            if (!auction) {

                return ApiResponse.error(
                    res,
                    404,
                    "Auction not found"
                );

            }

            return ApiResponse.success(
                res,
                "Auction fetched successfully",
                auction
            );
        }

    );

    // ==========================================================
    // Get All Auctions
    // ==========================================================

    static getAllAuctions = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const auctions =
                await AuctionService.getAllAuctions(
                    req.query as AuctionQuery
                );

            return ApiResponse.success(
                res,
                "Auctions fetched successfully",
                auctions
            );
        }

    );

    // ==========================================================
    // Get Active Auctions
    // ==========================================================

    static getActiveAuctions = asyncHandler(

        async (
            _req: Request,
            res: Response
        ) => {

            const auctions =
                await AuctionService.getActiveAuctions();

            return ApiResponse.success(
                res,
                "Active auctions fetched successfully",
                auctions
            );
        }

    );

    // ==========================================================
    // Get Auctions By NFT
    // ==========================================================

    static getAuctionsByNFT = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const nftId =
                Number(req.params.nftId);

            const auctions =
                await AuctionService.getAuctionsByNFT(
                    nftId
                );

            return ApiResponse.success(
                res,
                "NFT auctions fetched successfully",
                auctions
            );
        }

    );

    // ==========================================================
    // Update Auction
    // ==========================================================

    static updateAuction = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const seller =
                req.user!.wallet;

            const id =
                Number(req.params.id);

            await AuctionService.updateAuction(
                id,
                seller,
                req.body
            );

            return ApiResponse.success(
                res,
                "Auction updated successfully"
            );
        }

    );

    // ==========================================================
    // Cancel Auction
    // ==========================================================

    static cancelAuction = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const seller =
                req.user!.wallet;

            const id =
                Number(req.params.id);

            await AuctionService.cancelAuction(
                id,
                seller
            );

            return ApiResponse.success(
                res,
                "Auction cancelled successfully"
            );
        }

    );

    // ==========================================================
    // End Auction
    // ==========================================================

    static endAuction = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const id =
                Number(req.params.id);

            await AuctionService.endAuction(
                id
            );

            return ApiResponse.success(
                res,
                "Auction ended successfully"
            );
        }

    );

    // ==========================================================
    // Place Bid
    // ==========================================================

    static placeBid = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const bidder =
                req.user!.wallet;

            const id =
                Number(req.params.id);

            const bidAmount =
                Number(req.body.bid_amount);

            await AuctionService.updateHighestBid(
                id,
                bidder,
                bidAmount
            );

            return ApiResponse.success(
                res,
                "Bid placed successfully"
            );
        }

    );
}