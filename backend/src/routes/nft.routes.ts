import { Router } from "express";

import { NFTController } from "../controllers/nft.controller.js";

import { validate } from "../middleware/validate.js";

import {

    getAllNFTsValidator,

    getNFTValidator,

    getNFTsByOwnerValidator,

    getNFTsByCreatorValidator

} from "../validators/nft.validator.js";

const router = Router();

// ==========================================================
// Get All NFTs
// ==========================================================

router.get(

    "/",

    getAllNFTsValidator,

    validate,

    NFTController.getAllNFTs

);

// ==========================================================
// Get NFTs By Owner
// ==========================================================

router.get(

    "/owner/:wallet",

    getNFTsByOwnerValidator,

    validate,

    NFTController.getNFTsByOwner

);

// ==========================================================
// Get NFTs By Creator
// ==========================================================

router.get(

    "/creator/:wallet",

    getNFTsByCreatorValidator,

    validate,

    NFTController.getNFTsByCreator

);

// ==========================================================
// Get NFT By Token ID
// ==========================================================

router.get(

    "/:tokenId",

    getNFTValidator,

    validate,

    NFTController.getNFT

);

export default router;