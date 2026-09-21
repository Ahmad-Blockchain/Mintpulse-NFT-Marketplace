import {
    Request,
    Response
} from "express";

import {
    asyncHandler
} from "../utils/asyncHandler.js";

import {
    ApiResponse
} from "../utils/apiResponse.js";

import {
    OfferService
} from "../services/offer.service.js";

import {
    CreateOfferBody,
    OfferQuery,
    UpdateOfferBody
} from "../types/offer.types.js";


export class OfferController {

    // ==========================================================
    // Create Offer
    // ==========================================================

    static createOffer = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const buyer =
                req.user!.wallet;

            const body =
                req.body as CreateOfferBody;

            const id =
                await OfferService.createOffer(
                    buyer,
                    body
                );

            return ApiResponse.success(
                res,
                "Offer created successfully",
                {
                    id
                }
            );

        }

    );


    // ==========================================================
    // Get Offer
    // ==========================================================

    static getOffer = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const id =
                Number(req.params.id);

            const offer =
                await OfferService.getOfferById(
                    id
                );

            if (!offer) {

                return ApiResponse.error(
                    res,
                    404,
                    "Offer not found"
                );

            }

            return ApiResponse.success(
                res,
                "Offer fetched successfully",
                offer
            );

        }

    );


    // ==========================================================
    // Get All Offers
    // ==========================================================

    static getAllOffers = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const query =
                req.query as unknown as OfferQuery;

            const offers =
                await OfferService.getAllOffers(
                    query
                );

            return ApiResponse.success(
                res,
                "Offers fetched successfully",
                offers
            );

        }

    );


    // ==========================================================
    // Get NFT Offers
    // ==========================================================

    static getNFTOffers = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const nftId =
                Number(req.params.nftId);

            const offers =
                await OfferService.getOffersByNFT(
                    nftId
                );

            return ApiResponse.success(
                res,
                "NFT offers fetched successfully",
                offers
            );

        }

    );


    // ==========================================================
    // Get My Offers
    // ==========================================================

    static getMyOffers = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const buyer =
                req.user!.wallet;

            const offers =
                await OfferService.getOffersByBuyer(
                    buyer
                );

            return ApiResponse.success(
                res,
                "Your offers fetched successfully",
                offers
            );

        }

    );


    // ==========================================================
    // Get Received Offers
    // ==========================================================

    static getReceivedOffers = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const owner =
                req.user!.wallet;

            const offers =
                await OfferService.getOffersForOwner(
                    owner
                );

            return ApiResponse.success(
                res,
                "Received offers fetched successfully",
                offers
            );

        }

    );


    // ==========================================================
    // Update Offer
    // ==========================================================

    static updateOffer = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const buyer =
                req.user!.wallet;

            const id =
                Number(req.params.id);

            const body =
                req.body as UpdateOfferBody;

            await OfferService.updateOffer(
                id,
                buyer,
                body
            );

            return ApiResponse.success(
                res,
                "Offer updated successfully"
            );

        }

    );


    // ==========================================================
    // Cancel Offer
    // ==========================================================

    static cancelOffer = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const buyer =
                req.user!.wallet;

            const id =
                Number(req.params.id);

            await OfferService.cancelOffer(
                id,
                buyer
            );

            return ApiResponse.success(
                res,
                "Offer cancelled successfully"
            );

        }

    );


    // ==========================================================
    // Reject Offer
    // ==========================================================

    static rejectOffer = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const owner =
                req.user!.wallet;

            const id =
                Number(req.params.id);

            await OfferService.rejectOffer(
                id,
                owner
            );

            return ApiResponse.success(
                res,
                "Offer rejected successfully"
            );

        }

    );


    // ==========================================================
    // Accept Offer
    // ==========================================================

    static acceptOffer = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const owner =
                req.user!.wallet;

            const id =
                Number(req.params.id);

            await OfferService.acceptOffer(
                id,
                owner
            );

            return ApiResponse.success(
                res,
                "Offer accepted successfully"
            );

        }

    );

}