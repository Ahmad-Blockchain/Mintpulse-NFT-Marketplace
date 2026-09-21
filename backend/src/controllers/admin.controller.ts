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
    AdminService,
    AdminUserQuery,
    AdminNFTQuery
} from "../services/admin.service.js";

import {
    CollectionService
} from "../services/collection.service.js";

import {
    AdminCollectionQuery
} from "../types/admin.types.js";

export class AdminController {

    // ======================================================
    // Users
    // ======================================================

    static getUsers = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const query =
                req.query as unknown as AdminUserQuery;

            const result =
                await AdminService.getUsers(
                    query
                );

            return ApiResponse.success(
                res,
                "Admin users fetched successfully",
                result
            );

        }

    );

    // ======================================================
    // User By Wallet
    // ======================================================

    static getUser = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const wallet =
                String(req.params.wallet);

            const user =
                await AdminService.getUserByWallet(
                    wallet
                );

            if (!user) {

                return ApiResponse.error(
                    res,
                    404,
                    "User not found"
                );

            }

            return ApiResponse.success(
                res,
                "User fetched successfully",
                user
            );

        }

    );

    // ======================================================
    // NFTs
    // ======================================================

    static getNFTs = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const query =
                req.query as unknown as AdminNFTQuery;

            const result =
                await AdminService.getNFTs(
                    query
                );

            return ApiResponse.success(
                res,
                "Admin NFTs fetched successfully",
                result
            );

        }

    );

    // ======================================================
    // NFT By Token ID
    // ======================================================

    static getNFT = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const tokenId =
                Number(req.params.tokenId);

            const nft =
                await AdminService.getNFTsByTokenId(
                    tokenId
                );

            if (!nft) {

                return ApiResponse.error(
                    res,
                    404,
                    "NFT not found"
                );

            }

            return ApiResponse.success(
                res,
                "NFT fetched successfully",
                nft
            );

        }

    );

    // ======================================================
    // Collections
    // ======================================================

    static getCollections = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const query =
                req.query as unknown as AdminCollectionQuery;

            const page =
                Math.max(
                    Number(query.page ?? 1),
                    1
                );

            const limit =
                Math.min(
                    Math.max(
                        Number(query.limit ?? 20),
                        1
                    ),
                    100
                );

            const collections =
                await CollectionService.getAllCollections({
                    ...query,
                    page,
                    limit
                });

            return ApiResponse.success(
                res,
                "Admin collections fetched successfully",
                {
                    collections,
                    pagination: {
                        page,
                        limit,
                        total: collections.length,
                        totalPages:
                            collections.length === 0
                                ? 0
                                : 1
                    }
                }
            );

        }

    );

    // ======================================================
    // Collection By ID
    // ======================================================

    static getCollection = asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {

            const id =
                Number(req.params.id);

            const collection =
                await CollectionService.getCollectionById(
                    id
                );

            if (!collection) {

                return ApiResponse.error(
                    res,
                    404,
                    "Collection not found"
                );

            }

            return ApiResponse.success(
                res,
                "Admin collection fetched successfully",
                collection
            );

        }

    );

}