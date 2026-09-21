import dotenv from "dotenv";
import { ethers } from "ethers";
dotenv.config();
export const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
export const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
//# sourceMappingURL=blockchain.js.map