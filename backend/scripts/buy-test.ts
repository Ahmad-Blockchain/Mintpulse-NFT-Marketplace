import "dotenv/config";

import {
    JsonRpcProvider,
    Wallet,
    Contract,
    formatEther
} from "ethers";

import {
    MintPulseNFTABI,
    MintPulseMarketplaceABI
} from "../src/contracts/contracts.js";

// ==========================================================
// Configuration
// ==========================================================

const RPC_URL =
    process.env.BLOCKCHAIN_RPC_URL;

const PRIVATE_KEY =
    process.env.PRIVATE_KEY;

const NFT_CONTRACT =
    process.env.NFT_CONTRACT;

const MARKETPLACE_CONTRACT =
    process.env.MARKETPLACE_CONTRACT;

// ==========================================================
// Environment Validation
// ==========================================================

if (!RPC_URL) {
    throw new Error(
        "BLOCKCHAIN_RPC_URL is not configured"
    );
}

if (!PRIVATE_KEY) {
    throw new Error(
        "PRIVATE_KEY is not configured"
    );
}

if (!NFT_CONTRACT) {
    throw new Error(
        "NFT_CONTRACT is not configured"
    );
}

if (!MARKETPLACE_CONTRACT) {
    throw new Error(
        "MARKETPLACE_CONTRACT is not configured"
    );
}

// ==========================================================
// Blockchain Setup
// ==========================================================

const provider =
    new JsonRpcProvider(RPC_URL);

const wallet =
    new Wallet(
        PRIVATE_KEY,
        provider
    );

const nftContract =
    new Contract(
        NFT_CONTRACT,
        MintPulseNFTABI,
        wallet
    );

const marketplaceContract =
    new Contract(
        MARKETPLACE_CONTRACT,
        MintPulseMarketplaceABI,
        wallet
    );

// ==========================================================
// Main
// ==========================================================

async function main(): Promise<void> {

    const walletAddress =
        await wallet.getAddress();

    const tokenId = 1;

    console.log("");
    console.log("=================================");
    console.log("MintPulse NFT Buy Test");
    console.log("=================================");

    console.log(
        "Buyer       :",
        walletAddress
    );

    console.log(
        "NFT         :",
        NFT_CONTRACT
    );

    console.log(
        "Marketplace :",
        MARKETPLACE_CONTRACT
    );

    console.log(
        "Token ID    :",
        tokenId
    );

    // ======================================================
    // Get NFT Owner
    // ======================================================

    const currentOwner =
        await nftContract.ownerOf(
            tokenId
        );

    console.log("");
    console.log(
        "Current NFT Owner :",
        currentOwner
    );

    // ======================================================
    // Get Listing
    // ======================================================

    const listing =
        await marketplaceContract.getListing(
            NFT_CONTRACT,
            tokenId
        );

    console.log("");
    console.log("=================================");
    console.log("Current Listing");
    console.log("=================================");

    console.log(
        "Seller      :",
        listing.seller
    );

    console.log(
        "Price       :",
        listing.price.toString()
    );

    console.log(
        "Price ETH   :",
        formatEther(listing.price)
    );

    // ======================================================
    // Validate Listing
    // ======================================================

    if (
        listing.seller ===
        "0x0000000000000000000000000000000000000000"
    ) {

        throw new Error(
            "NFT is not currently listed"
        );

    }

    if (
        listing.price === 0n
    ) {

        throw new Error(
            "Listing price is zero"
        );

    }

    // ======================================================
    // Prevent Seller From Buying Own NFT
    // ======================================================

    if (
        listing.seller.toLowerCase() ===
        walletAddress.toLowerCase()
    ) {

        throw new Error(
            "Buyer wallet is the seller wallet. Use a different buyer account."
        );

    }

    // ======================================================
    // Check Buyer Balance
    // ======================================================

    const balance =
        await provider.getBalance(
            walletAddress
        );

    console.log("");
    console.log(
        "Buyer Balance :",
        formatEther(balance),
        "ETH"
    );

    if (
        balance < listing.price
    ) {

        throw new Error(
            "Buyer does not have enough ETH"
        );

    }

    // ======================================================
    // Buy NFT
    // ======================================================

    console.log("");
    console.log("=================================");
    console.log("Buying NFT");
    console.log("=================================");

    console.log(
        "Payment :",
        formatEther(listing.price),
        "ETH"
    );

    console.log(
        "Sending buyNFT transaction..."
    );

    const transaction =
        await marketplaceContract.buyNFT(
            NFT_CONTRACT,
            tokenId,
            {
                value: listing.price
            }
        );

    console.log("");
    console.log(
        "Transaction submitted!"
    );

    console.log(
        "TX Hash:",
        transaction.hash
    );

    console.log("");
    console.log(
        "Waiting for confirmation..."
    );

    const receipt =
        await transaction.wait();

    if (!receipt) {

        throw new Error(
            "Transaction receipt not received"
        );

    }

    // ======================================================
    // Confirmation
    // ======================================================

    console.log("");
    console.log("=================================");
    console.log("NFT Purchase Confirmed");
    console.log("=================================");

    console.log(
        "TX Hash :",
        receipt.hash
    );

    console.log(
        "Block   :",
        receipt.blockNumber
    );

    console.log(
        "Token   :",
        tokenId
    );

    console.log(
        "Buyer   :",
        walletAddress
    );

    console.log(
        "Price   :",
        formatEther(listing.price),
        "ETH"
    );

    // ======================================================
    // Verify New Owner
    // ======================================================

    const newOwner =
        await nftContract.ownerOf(
            tokenId
        );

    console.log("");
    console.log("=================================");
    console.log("Ownership Verification");
    console.log("=================================");

    console.log(
        "New Owner :",
        newOwner
    );

    if (
        newOwner.toLowerCase() !==
        walletAddress.toLowerCase()
    ) {

        throw new Error(
            "NFT ownership verification failed"
        );

    }

    console.log(
        "NFT ownership verified successfully"
    );

    console.log("");
}

// ==========================================================
// Execute
// ==========================================================

main().catch(
    (error: unknown) => {

        console.error("");
        console.error(
            "================================="
        );

        console.error(
            "NFT Buy Test Failed"
        );

        console.error(
            "================================="
        );

        console.error(error);

        process.exit(1);

    }
);