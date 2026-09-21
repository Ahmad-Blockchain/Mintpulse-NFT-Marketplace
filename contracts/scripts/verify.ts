import * as fs from "fs";
import * as path from "path";

async function main() {
    const sepoliaPath = path.join(__dirname, "../deployments/sepolia.json");
    if (!fs.existsSync(sepoliaPath)) {
        console.error("Sepolia deployment file not found. Run deploy-sepolia.ts first.");
        return;
    }

    const deployment = JSON.parse(fs.readFileSync(sepoliaPath, "utf-8"));
    console.log("Preparing contract verification commands for Etherscan...");
    console.log(`npx hardhat verify --network sepolia ${deployment.contracts.MintPulseNFT} "MintPulse NFT" "MPNFT" "${deployment.deployer}" 250`);
    console.log(`npx hardhat verify --network sepolia ${deployment.contracts.MintPulseMarketplace} "${deployment.deployer}"`);
}

main().catch((err) => console.error(err));
