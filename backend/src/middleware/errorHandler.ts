import { Request, Response, NextFunction } from "express";

export function errorHandler(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) {

    console.error("");

    console.error("=================================");
    console.error("Server Error");
    console.error("=================================");

    console.error(err);

    console.error("");

    const statusCode =
        err.statusCode || 500;

    const message =
        err.message || "Internal Server Error";

    return res.status(statusCode).json({

        success: false,

        message,

        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack
        })

    });

}