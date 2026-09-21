// ==========================================================
// MintPulse Contract Configuration
// ==========================================================

import "dotenv/config";

import { createRequire } from "node:module";

import {
    Contract,
    JsonRpcProvider,
    Wallet,
    type InterfaceAbi,
} from "ethers";

// ==========================================================
// JSON Loader
// ==========================================================

const require = createRequire(import.meta.url);

// ==========================================================
// Contract Artifact Type
// ==========================================================

interface ContractArtifact {
    abi: InterfaceAbi;
}

// ==========================================================
// Load Contract Artifacts
// ==========================================================

const MintPulseNFTArtifact =
    require("../../abi/MintPulseNFT.json") as ContractArtifact;

const MintPulseMarketplaceArtifact =
    require("../../abi/MintPulseMarketplace.json") as ContractArtifact;

// ==========================================================
// Contract ABIs
// ==========================================================

export const MintPulseNFTABI: InterfaceAbi =
    MintPulseNFTArtifact.abi;

export const MintPulseMarketplaceABI: InterfaceAbi =
    MintPulseMarketplaceArtifact.abi;

// ==========================================================
// Environment Configuration
// ==========================================================

const RPC_URL =
    process.env.BLOCKCHAIN_RPC_URL ??
    process.env.RPC_URL ??
    process.env.SEPOLIA_RPC_URL ??
    "";

const PRIVATE_KEY =
    process.env.PRIVATE_KEY ??
    process.env.BLOCKCHAIN_PRIVATE_KEY ??
    "";

// ==========================================================
// Contract Addresses
// ==========================================================

// Preferred names
// Backward-compatible with previous configuration names.

export const MINTPULSE_NFT_ADDRESS =
    process.env.NFT_CONTRACT ??
    process.env.MINTPULSE_NFT_ADDRESS ??
    "";

export const MINTPULSE_MARKETPLACE_ADDRESS =
    process.env.MARKETPLACE_CONTRACT ??
    process.env.MINTPULSE_MARKETPLACE_ADDRESS ??
    "";

// ==========================================================
// Configuration Validation
// ==========================================================

function requireConfig(
    value: string,
    name: string
): string {

    const trimmedValue = value.trim();

    if (!trimmedValue) {

        throw new Error(
            `${name} is not configured. ` +
            `Please check your backend .env file.`
        );

    }

    return trimmedValue;
}

// ==========================================================
// Required Configuration
// ==========================================================

const requiredRpcUrl =
    requireConfig(
        RPC_URL,
        "BLOCKCHAIN_RPC_URL"
    );

const requiredPrivateKey =
    requireConfig(
        PRIVATE_KEY,
        "PRIVATE_KEY"
    );

const requiredNFTAddress =
    requireConfig(
        MINTPULSE_NFT_ADDRESS,
        "NFT_CONTRACT"
    );

const requiredMarketplaceAddress =
    requireConfig(
        MINTPULSE_MARKETPLACE_ADDRESS,
        "MARKETPLACE_CONTRACT"
    );

// ==========================================================
// Blockchain Provider
// ==========================================================

export const provider =
    new JsonRpcProvider(
        requiredRpcUrl
    );

// ==========================================================
// Blockchain Signer
// ==========================================================

export const signer =
    new Wallet(
        requiredPrivateKey,
        provider
    );

// ==========================================================
// NFT Contract
// ==========================================================

export const nftContract =
    new Contract(
        requiredNFTAddress,
        MintPulseNFTABI,
        signer
    );

// ==========================================================
// Marketplace Contract
// ==========================================================

export const marketplaceContract =
    new Contract(
        requiredMarketplaceAddress,
        MintPulseMarketplaceABI,
        signer
    );

// ==========================================================
// Configuration Status
// ==========================================================

export const blockchainConfig = {

    rpcUrl: requiredRpcUrl,

    nftAddress:
        requiredNFTAddress,

    marketplaceAddress:
        requiredMarketplaceAddress,

};