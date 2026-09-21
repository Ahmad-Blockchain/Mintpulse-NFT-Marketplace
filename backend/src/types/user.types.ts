import { ParamsDictionary } from "express-serve-static-core";

export interface WalletParams extends ParamsDictionary {
    wallet: string;
}

export interface CreateUserBody {
    wallet: string;
    username: string;
    avatar?: string | null;
    bio?: string | null;
}

export interface UpdateUserBody {
    username: string;
    avatar?: string | null;
    bio?: string | null;
}