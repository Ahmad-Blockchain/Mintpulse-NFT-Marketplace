import { ethers } from "ethers";
import { provider } from "./blockchain.js";
import { config } from "./env.js";

// ABIs
import MintPulseNFTAbi from "../abi/MintPulseNFT.json" with { type: "json" };
import MintPulseMarketplaceAbi from "../abi/MintPulseMarketplace.json" with { type: "json" };

export const nftContract = new ethers.Contract(config.nftAddress, MintPulseNFTAbi, provider);
export const marketplaceContract = new ethers.Contract(config.marketplaceAddress, MintPulseMarketplaceAbi, provider);
