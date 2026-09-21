// ==========================================================
// MintPulse NFT Listing Test
// Production-Ready Local/Testnet Listing Script
// ==========================================================

import "dotenv/config";

import {
    Contract,
    JsonRpcProvider,
    Wallet
} from "ethers";

import {
    MintPulseNFTABI,
    MintPulseMarketplaceABI
} from "../src/contracts/contracts.js";

// ==========================================================
// Environment
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
// Provider
// ==========================================================

const provider =
    new JsonRpcProvider(RPC_URL);

// ==========================================================
// Wallet
// ==========================================================

const wallet =
    new Wallet(
        PRIVATE_KEY,
        provider
    );

// ==========================================================
// NFT Contract
// ==========================================================

const nftContract =
    new Contract(
        NFT_CONTRACT,
        MintPulseNFTABI,
        wallet
    );

// ==========================================================
// Marketplace Contract
// ==========================================================

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

    // ------------------------------------------------------
    // Test Configuration
    // ------------------------------------------------------

    const tokenId = 1;

    // 0.01 ETH
    const price =
        "10000000000000000";

    console.log("");

    console.log(
        "================================="
    );

    console.log(
        "MintPulse NFT Listing Test"
    );

    console.log(
        "================================="
    );

    console.log(
        "Wallet      :",
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

    console.log(
        "Price       :",
        price
    );

    console.log(
        "Price ETH   :",
        Number(price) / 1e18
    );

    console.log("");

    // ======================================================
    // 1. Verify NFT Ownership
    // ======================================================

    console.log(
        "Checking NFT ownership..."
    );

    const owner =
        await nftContract.ownerOf(tokenId);

    console.log(
        "Current Owner:",
        owner
    );

    if (
        owner.toLowerCase() !==
        walletAddress.toLowerCase()
    ) {

        throw new Error(
            `Wallet does not own NFT #${tokenId}. ` +
            `Current owner: ${owner}`
        );

    }

    console.log(
        "Ownership verified."
    );

    console.log("");

    // ======================================================
    // 2. Check Existing Listing
    // ======================================================

    console.log(
        "Checking existing listing..."
    );

    let existingListing: any = null;

    try {

        existingListing =
            await marketplaceContract.getListing(
                NFT_CONTRACT,
                tokenId
            );

    } catch {

        console.log(
            "Listing lookup unavailable; continuing..."
        );

    }

    if (existingListing) {

        const seller =
            existingListing.seller;

        const listingPrice =
            existingListing.price;

        if (
            seller &&
            seller !==
                "0x0000000000000000000000000000000000000000"
            &&
            listingPrice &&
            listingPrice > 0n
        ) {

            console.log("");

            console.log(
                "NFT is already listed."
            );

            console.log(
                "Seller:",
                seller
            );

            console.log(
                "Price:",
                listingPrice.toString()
            );

            console.log("");

            return;

        }

    }

    console.log(
        "No active listing found."
    );

    console.log("");

    // ======================================================
    // 3. Check Marketplace Approval
    // ======================================================

    console.log(
        "Checking marketplace approval..."
    );

    const approvedAddress =
        await nftContract.getApproved(
            tokenId
        );

    console.log(
        "Approved Address:",
        approvedAddress
    );

    const isApproved =
        approvedAddress.toLowerCase() ===
        MARKETPLACE_CONTRACT!.toLowerCase();

    // ======================================================
    // 4. Get Fresh Pending Nonce
    // ======================================================

    let nonce =
        await provider.getTransactionCount(
            walletAddress,
            "pending"
        );

    console.log(
        "Starting Nonce:",
        nonce
    );

    console.log("");

    // ======================================================
    // 5. Approve Marketplace
    // ======================================================

    if (!isApproved) {

        console.log(
            "Approving marketplace..."
        );

        const approvalTx =
            await nftContract.approve(
                MARKETPLACE_CONTRACT,
                tokenId,
                {
                    nonce
                }
            );

        console.log(
            "Approval TX:",
            approvalTx.hash
        );

        await approvalTx.wait();

        console.log(
            "Marketplace approved."
        );

        // Move to next nonce after confirmed approval
        nonce += 1;

    } else {

        console.log(
            "Marketplace already approved."
        );

    }

    console.log("");

    // ======================================================
    // 6. Refresh Nonce
    // ======================================================

    nonce =
        await provider.getTransactionCount(
            walletAddress,
            "pending"
        );

    console.log(
        "Listing Nonce:",
        nonce
    );

    console.log("");

    // ======================================================
    // 7. Create Listing
    // ======================================================

    console.log(
        "Creating listing..."
    );

    const listingTx =
        await marketplaceContract.listNFT(
            NFT_CONTRACT,
            tokenId,
            price,
            {
                nonce
            }
        );

    console.log(
        "Listing TX:",
        listingTx.hash
    );

    console.log("");

    console.log(
        "Waiting for confirmation..."
    );

    const receipt =
        await listingTx.wait();

    if (!receipt) {

        throw new Error(
            "Listing transaction receipt was not returned"
        );

    }

    // ======================================================
    // 8. Verify Listing On-Chain
    // ======================================================

    console.log("");

    console.log(
        "Verifying listing..."
    );

    let verifiedListing: any;

    try {

        verifiedListing =
            await marketplaceContract.listings(
                NFT_CONTRACT,
                tokenId
            );

    } catch (error) {

        console.error(
            "Unable to verify listing:",
            error
        );

        throw new Error(
            "Listing transaction succeeded, " +
            "but listing verification failed"
        );

    }

    console.log(
        "Seller      :",
        verifiedListing.seller
    );

    console.log(
        "Price       :",
        verifiedListing.price.toString()
    );

    // ======================================================
    // 9. Validate Listing
    // ======================================================

    if (
        verifiedListing.seller.toLowerCase() !==
        walletAddress.toLowerCase()
    ) {

        throw new Error(
            "Listing seller verification failed"
        );

    }

    if (
        verifiedListing.price.toString() !==
        price
    ) {

        throw new Error(
            "Listing price verification failed"
        );

    }

    // ======================================================
    // Success
    // ======================================================

    console.log("");

    console.log(
        "================================="
    );

    console.log(
        "NFT Listing Confirmed"
    );

    console.log(
        "================================="
    );

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
        "Seller  :",
        walletAddress
    );

    console.log(
        "Price   :",
        price
    );

    console.log(
        "Status  : ACTIVE"
    );

    console.log("");

}

// ==========================================================
// Error Handler
// ==========================================================

main().catch(
    (error: unknown) => {

        console.error("");

        console.error(
            "================================="
        );

        console.error(
            "NFT Listing Test Failed"
        );

        console.error(
            "================================="
        );

        if (
            error instanceof Error
        ) {

            console.error(
                error.message
            );

        } else {

            console.error(
                error
            );

        }

        console.error("");

        process.exit(1);

    }
);