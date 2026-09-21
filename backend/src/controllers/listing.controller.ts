
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
    ListingService
} from "../services/listing.service.js";

import {
    CreateListingBody,
    ListingQuery,
    UpdateListingBody
} from "../types/listing.types.js";


export class ListingController {

    // ==========================================================
    // Create Listing
    // ==========================================================

    static createListing = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const seller =
                req.user!.wallet;

            const body =
                req.body as CreateListingBody;

            const id =
                await ListingService.createListing(
                    seller,
                    body
                );

            return ApiResponse.success(
                res,
                "Listing created successfully",
                {
                    id
                }
            );

        }

    );


    // ==========================================================
    // Get Active Listings
    // ==========================================================

    static getActiveListings = asyncHandler(

        async (
            _req: Request,
            res: Response
        ) => {

            const listings =
                await ListingService.getActiveListings();

            return ApiResponse.success(
                res,
                "Listings fetched successfully",
                listings
            );

        }

    );


    // ==========================================================
    // Get Listing By ID
    // ==========================================================

    static getListing = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const id =
                Number(req.params.id);

            const listing =
                await ListingService.getListingById(
                    id
                );

            if (!listing) {

                return ApiResponse.error(
                    res,
                    404,
                    "Listing not found"
                );

            }

            return ApiResponse.success(
                res,
                "Listing fetched successfully",
                listing
            );

        }

    );


    // ==========================================================
    // Get All Listings
    // ==========================================================

    static getAllListings = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const query =
                req.query as unknown as ListingQuery;

            const listings =
                await ListingService.getAllListings(
                    query
                );

            return ApiResponse.success(
                res,
                "Listings fetched successfully",
                listings
            );

        }

    );


    // ==========================================================
    // Update Listing
    // ==========================================================

    static updateListing = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const seller =
                req.user!.wallet;

            const id =
                Number(req.params.id);

            const body =
                req.body as UpdateListingBody;

            await ListingService.updateListing(
                id,
                seller,
                body
            );

            return ApiResponse.success(
                res,
                "Listing updated successfully"
            );

        }

    );


    // ==========================================================
    // Cancel Listing
    // ==========================================================

    static cancelListing = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const seller =
                req.user!.wallet;

            const id =
                Number(req.params.id);

            await ListingService.cancelListing(
                id,
                seller
            );

            return ApiResponse.success(
                res,
                "Listing cancelled successfully"
            );

        }

    );

}

