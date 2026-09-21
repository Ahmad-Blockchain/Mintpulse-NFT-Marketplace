import { Request, Response, NextFunction } from "express";

export function notFound(
    req: Request,
    res: Response,
    next: NextFunction
) {

    const error = new Error(

        `Route Not Found: ${req.originalUrl}`

    ) as any;

    error.statusCode = 404;

    next(error);

}