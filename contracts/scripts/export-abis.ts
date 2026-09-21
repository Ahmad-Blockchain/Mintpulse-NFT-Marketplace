import * as fs from "fs";
import * as path from "path";

async function main() {
    console.log("Exporting compiled ABIs to backend & frontend...");
    const artifactsDir = path.join(__dirname, "../artifacts/contracts/contracts");
    
    if (!fs.existsSync(artifactsDir)) {
        console.warn("Artifacts directory not found. Please compile contracts first (`npx hardhat compile`).");
        return;
    }

    const nftArtifact = JSON.parse(
        fs.readFileSync(path.join(artifactsDir, "MintPulseNFT.sol/MintPulseNFT.json"), "utf-8")
    );
    const marketplaceArtifact = JSON.parse(
        fs.readFileSync(path.join(artifactsDir, "MintPulseMarketplace.sol/MintPulseMarketplace.json"), "utf-8")
    );

    const abiOutput = {
        MintPulseNFT: nftArtifact.abi,
        MintPulseMarketplace: marketplaceArtifact.abi,
    };

    // Save to backend abi directory if exists
    const backendAbiDir = path.join(__dirname, "../../backend/abi");
    if (fs.existsSync(backendAbiDir)) {
        fs.writeFileSync(path.join(backendAbiDir, "MintPulseNFT.json"), JSON.stringify(nftArtifact.abi, null, 2));
        fs.writeFileSync(path.join(backendAbiDir, "MintPulseMarketplace.json"), JSON.stringify(marketplaceArtifact.abi, null, 2));
        console.log("Exported ABIs to backend/abi/");
    }

    console.log("ABI Export complete!");
}

main().catch((err) => console.error(err));
