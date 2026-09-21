import { Response } from "express";

export class ApiResponse {

    // ==========================================================
    // Success Response (200)
    // ==========================================================

    static success(

        res: Response,

        message: string,

        data: any = null

    ) {

        return res.status(200).json({

            success: true,

            message,

            data

        });

    }

    // ==========================================================
    // Created Response (201)
    // ==========================================================

    static created(

        res: Response,

        message: string,

        data: any = null

    ) {

        return res.status(201).json({

            success: true,

            message,

            data

        });

    }

    // ==========================================================
    // Error Response
    // ==========================================================

    static error(

        res: Response,

        statusCode: number,

        message: string

    ) {

        return res.status(statusCode).json({

            success: false,

            message

        });

    }

    // ==========================================================
    // Paginated Response
    // ==========================================================

    static paginated(

        res: Response,

        message: string,

        data: any,

        page: number,

        limit: number,

        total: number

    ) {

        return res.status(200).json({

            success: true,

            message,

            data,

            pagination: {

                page,

                limit,

                total,

                totalPages: Math.ceil(total / limit)

            }

        });

    }

}