import "express";

declare global {

    namespace Express {

        interface Request {

            user?: {

                wallet: string;

            };

        }

    }

}

export {};