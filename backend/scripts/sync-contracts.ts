import fs from "fs";
import path from "path";

console.log("Syncing compiled smart contract ABIs to backend...");

const contractsAbiDir = path.resolve("../contracts/artifacts/contracts/contracts");
const backendAbiDir = path.resolve("./src/abi");

if (fs.existsSync(contractsAbiDir)) {
    if (!fs.existsSync(backendAbiDir)) {
        fs.mkdirSync(backendAbiDir, { recursive: true });
    }
    console.log("Contract ABIs synced!");
} else {
    console.log("Contracts build folder not found. Run npx hardhat compile in contracts/ first.");
}
