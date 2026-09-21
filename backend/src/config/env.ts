import dotenv from "dotenv";
dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || "development",
    databaseUrl: process.env.DATABASE_URL || "mysql://root:password@localhost:3306/mintpulse",
    jwtSecret: process.env.JWT_SECRET || "supersecretjwtkey",
    rpcUrl: process.env.SEPOLIA_RPC_URL || "http://127.0.0.1:8545",
    nftAddress: process.env.NFT_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    marketplaceAddress: process.env.MARKETPLACE_CONTRACT_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
};
