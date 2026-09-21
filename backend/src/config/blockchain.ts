import { ethers } from "ethers";
import { config } from "./env.js";

export const provider = new ethers.JsonRpcProvider(config.rpcUrl);