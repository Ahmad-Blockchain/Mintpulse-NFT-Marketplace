// ==========================================================
// MintPulse Express Application
// ==========================================================
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// ==========================================================
// Middleware
// ==========================================================
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
// ==========================================================
// Routes
// ==========================================================
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import nftRoutes from "./routes/nft.routes.js";
import marketplaceRoutes from "./routes/marketplace.routes.js";
import listingRoutes from "./routes/listing.routes.js";
import offerRoutes from "./routes/offer.routes.js";
import auctionRoutes from "./routes/auction.routes.js";
import bidRoutes from "./routes/bid.routes.js";
import collectionRoutes from "./routes/collection.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import adminRoutes from "./routes/admin.routes.js";
// ==========================================================
// Express Application
// ==========================================================
const app = express();
// ==========================================================
// Security Middleware
// ==========================================================
app.use(helmet());
app.use(cors());
// ==========================================================
// Logging Middleware
// ==========================================================
app.use(morgan("dev"));
// ==========================================================
// Body Parsing Middleware
// ==========================================================
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
// ==========================================================
// Health Check
// ==========================================================
app.get("/", (_req, res) => {
    return res.json({
        success: true,
        message: "MintPulse Backend Running"
    });
});
// ==========================================================
// Authentication Routes
// ==========================================================
app.use("/api/auth", authRoutes);
// ==========================================================
// User Routes
// ==========================================================
app.use("/api/users", userRoutes);
// ==========================================================
// NFT Routes
// ==========================================================
app.use("/api/nfts", nftRoutes);
// ==========================================================
// Marketplace Routes
// ==========================================================
app.use("/api/marketplace", marketplaceRoutes);
// ==========================================================
// Listing Routes
// ==========================================================
app.use("/api/listings", listingRoutes);
// ==========================================================
// Offer Routes
// ==========================================================
app.use("/api/offers", offerRoutes);
// ==========================================================
// Auction Routes
// ==========================================================
app.use("/api/auctions", auctionRoutes);
// ==========================================================
// Bid Routes
// ==========================================================
app.use("/api/bids", bidRoutes);
// ==========================================================
// Collection Routes
// ==========================================================
app.use("/api/collections", collectionRoutes);
// ==========================================================
// Transaction Routes
// ==========================================================
app.use("/api/transactions", transactionRoutes);
// ==========================================================
// Admin Routes
// ==========================================================
app.use("/api/admin", adminRoutes);
// ==========================================================
// 404 Handler
// ==========================================================
app.use(notFound);
// ==========================================================
// Global Error Handler
// ==========================================================
app.use(errorHandler);
// ==========================================================
// Export Application
// ==========================================================
export default app;
//# sourceMappingURL=app.js.map