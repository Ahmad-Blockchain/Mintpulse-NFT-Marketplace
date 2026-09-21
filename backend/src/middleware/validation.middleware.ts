import { Request, Response, NextFunction } from "express";

import { validationResult } from "express-validator";

export function validationMiddleware(

    req: Request,

    res: Response,

    next: NextFunction

) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({

            success: false,

            message: "Validation Failed",

            errors: errors.array()

        });

    }

    next();

}