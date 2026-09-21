import hre, { network } from "hardhat";

async function main() {

    console.log("========================================");
    console.log("      MintPulse Deployment Started");
    console.log("========================================");

    const { ethers } = await network.connect();

const [deployer] =
    await ethers.getSigners();

    console.log("Deployer:", deployer.address);

    console.log("");

    // =====================================================
    // Deploy NFT Contract
    // =====================================================

    console.log("Deploying MintPulseNFT...");

    const NFTFactory =
        await ethers.getContractFactory(
            "MintPulseNFT"
        );

    const nft =
        await NFTFactory.deploy(
            "MintPulse NFT",
            "MPNFT",
            deployer.address,
            250
        );

    await nft.waitForDeployment();

    const nftAddress =
        await nft.getAddress();

    console.log("NFT Contract:");

    console.log(nftAddress);

    console.log("");

    // =====================================================
    // Deploy Marketplace
    // =====================================================

    console.log("Deploying Marketplace...");

    const MarketplaceFactory =
        await ethers.getContractFactory(
            "MintPulseMarketplace"
        );

    const marketplace =
        await MarketplaceFactory.deploy(
            deployer.address
        );

    await marketplace.waitForDeployment();

    const marketplaceAddress =
        await marketplace.getAddress();

    console.log("Marketplace:");

    console.log(marketplaceAddress);

    console.log("");

    // =====================================================
    // Connect Contracts
    // =====================================================

    console.log("Connecting Contracts...");

    const tx =
        await nft.setMarketplace(
            marketplaceAddress
        );

    await tx.wait();

    console.log("Marketplace Connected");

    console.log("");

    console.log("========================================");

    console.log("Deployment Completed");

    console.log("========================================");

    console.log("");

    console.log("NFT:");

    console.log(nftAddress);

    console.log("");

    console.log("Marketplace:");

    console.log(marketplaceAddress);

}

main().catch((error) => {

    console.error(error);

    process.exitCode = 1;

});