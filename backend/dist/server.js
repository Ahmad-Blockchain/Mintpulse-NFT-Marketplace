import dotenv from "dotenv";
dotenv.config();
import { startNFTEvents } from "./events/nft.events.js";
import { startMarketplaceEvents } from "./events/marketplace.events.js";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { BlockchainSyncService } from "./services/blockchainSync.service.js";
const PORT = Number(process.env.PORT) || 5000;
async function startServer() {
    try {
        await connectDatabase();
        await BlockchainSyncService.syncNFTEvents();
        await BlockchainSyncService.syncMarketplaceEvents();
        startNFTEvents();
        startMarketplaceEvents();
        app.listen(PORT, () => {
            console.log("");
            console.log("=================================");
            console.log("MintPulse Backend Started");
            console.log("=================================");
            console.log(`Server : http://localhost:${PORT}`);
            console.log(`Environment : ${process.env.NODE_ENV}`);
            console.log("");
        });
    }
    catch (error) {
        console.error("Failed to start server");
        console.error(error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map