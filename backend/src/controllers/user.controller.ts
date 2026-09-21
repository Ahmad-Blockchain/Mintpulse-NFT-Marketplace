import { Request, Response } from "express";

import { UserService } from "../services/user.service.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NotFoundError } from "../errors/NotFoundError.js";

import {
    WalletParams,
    CreateUserBody,
    UpdateUserBody
} from "../types/user.types.js";

export class UserController {

    // ==========================================================
    // Create User
    // ==========================================================

    static createUser = asyncHandler(

        async (

            req: Request<{}, {}, CreateUserBody>,

            res: Response

        ) => {

            const {

                wallet,

                username,

                avatar,

                bio

            } = req.body;

            const exists =
                await UserService.getUserByWallet(
                    wallet
                );

            if (exists) {

                return ApiResponse.error(

                    res,

                    409,

                    "User already exists"

                );

            }

            await UserService.createUser(

                wallet,

                username,

                avatar ?? null,

                bio ?? null

            );

            return ApiResponse.created(

                res,

                "User created successfully"

            );

        }

    );

    // ==========================================================
    // Get All Users
    // ==========================================================

    static getUsers = asyncHandler(

        async (

            _req: Request,

            res: Response

        ) => {

            const users =
                await UserService.getUsers();

            return ApiResponse.success(

                res,

                "Users fetched successfully",

                users

            );

        }

    );

    // ==========================================================
    // Get User
    // ==========================================================

    static getUser = asyncHandler(

        async (

            req: Request<WalletParams>,

            res: Response

        ) => {

            const wallet = req.params.wallet;

            const user =
                await UserService.getUserByWallet(
                    wallet
                );

            if (!user) {

                throw new NotFoundError(
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

    // ==========================================================
    // Update User
    // ==========================================================

    static updateUser = asyncHandler(

        async (

            req: Request<
                WalletParams,
                {},
                UpdateUserBody
            >,

            res: Response

        ) => {

            const wallet = req.params.wallet;

            const {

                username,

                avatar,

                bio

            } = req.body;

            const user =
                await UserService.getUserByWallet(
                    wallet
                );

            if (!user) {

                throw new NotFoundError(
                    "User not found"
                );

            }

            await UserService.updateUser(

                wallet,

                username,

                avatar ?? null,

                bio ?? null

            );

            return ApiResponse.success(

                res,

                "User updated successfully"

            );

        }

    );

    // ==========================================================
    // Delete User
    // ==========================================================

    static deleteUser = asyncHandler(

        async (

            req: Request<WalletParams>,

            res: Response

        ) => {

            const wallet = req.params.wallet;

            const user =
                await UserService.getUserByWallet(
                    wallet
                );

            if (!user) {

                throw new NotFoundError(
                    "User not found"
                );

            }

            await UserService.deleteUser(
                wallet
            );

            return ApiResponse.success(

                res,

                "User deleted successfully"

            );

        }

    );

}