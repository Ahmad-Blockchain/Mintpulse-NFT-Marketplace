import {
    Request,
    Response,
    NextFunction,
    RequestHandler,
} from "express";

import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export function asyncHandler<
    P = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs
>(
    fn: (
        req: Request<P, ResBody, ReqBody, ReqQuery>,
        res: Response<ResBody>,
        next: NextFunction
    ) => Promise<any>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> {

    return (

        req,

        res,

        next

    ) => {

        Promise.resolve(

            fn(req, res, next)

        ).catch(next);

    };

}