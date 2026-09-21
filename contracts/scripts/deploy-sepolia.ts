import { network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
    const { ethers } = await network.getOrCreate();
    const [deployer] = await ethers.getSigners();

    console.log("==================================================");
    console.log("Deploying MintPulse Contracts to Sepolia Testnet");
    console.log("Deployer Address:", deployer.address);
    console.log("==================================================");

    const NFT = await ethers.getContractFactory("MintPulseNFT");
    const nft = await NFT.deploy("MintPulse NFT", "MPNFT", deployer.address, 250);
    await nft.waitForDeployment();
    const nftAddress = await nft.getAddress();
    console.log("MintPulseNFT deployed to:", nftAddress);

    const Marketplace = await ethers.getContractFactory("MintPulseMarketplace");
    const marketplace = await Marketplace.deploy(deployer.address);
    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    console.log("MintPulseMarketplace deployed to:", marketplaceAddress);

    // Save deployment output
    const deploymentsDir = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const deploymentData = {
        network: "sepolia",
        chainId: 11155111,
        deployer: deployer.address,
        contracts: {
            MintPulseNFT: nftAddress,
            MintPulseMarketplace: marketplaceAddress,
        },
        timestamp: new Date().toISOString(),
    };

    fs.writeFileSync(
        path.join(deploymentsDir, "sepolia.json"),
        JSON.stringify(deploymentData, null, 2)
    );
    console.log("Saved Sepolia deployment to deployments/sepolia.json");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
