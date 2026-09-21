import "dotenv/config";

import {
    JsonRpcProvider,
    Wallet,
    Contract
} from "ethers";

import { MintPulseNFTABI } from "../src/contracts/contracts.js";

const RPC_URL =
    process.env.BLOCKCHAIN_RPC_URL;

const PRIVATE_KEY =
    process.env.PRIVATE_KEY;

const NFT_ADDRESS =
    process.env.NFT_CONTRACT ??
    process.env.MINTPULSE_NFT_ADDRESS;

if (!RPC_URL) {
    throw new Error("BLOCKCHAIN_RPC_URL is not configured");
}

if (!PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is not configured");
}

if (!NFT_ADDRESS) {
    throw new Error("NFT contract address is not configured");
}

const provider =
    new JsonRpcProvider(RPC_URL);

const wallet =
    new Wallet(
        PRIVATE_KEY,
        provider
    );

const nftContract =
    new Contract(
        NFT_ADDRESS,
        MintPulseNFTABI,
        wallet
    );

async function main() {

    const address =
        await wallet.getAddress();

    console.log("");
    console.log("=================================");
    console.log("MintPulse NFT Mint Test");
    console.log("=================================");
    console.log("Wallet    :", address);
    console.log("Contract  :", NFT_ADDRESS);

    const metadataURI =
        "ipfs://mintpulse-test-001";

    console.log("Metadata  :", metadataURI);
    console.log("");
    console.log("Sending mint transaction...");

    const tx =
        await nftContract.mintNFT(
            address,
            metadataURI
        );

    console.log("");
    console.log("Transaction submitted!");
    console.log("TX Hash:", tx.hash);

    console.log("");
    console.log("Waiting for confirmation...");

    const receipt =
        await tx.wait();

    console.log("");
    console.log("=================================");
    console.log("Mint Confirmed");
    console.log("=================================");
    console.log("TX Hash :", receipt.hash);
    console.log("Block   :", receipt.blockNumber);
    console.log("");
}

main().catch((error) => {

    console.error("");
    console.error("Mint test failed:");
    console.error(error);

    process.exit(1);

});