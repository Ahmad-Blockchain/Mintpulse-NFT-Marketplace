# 💎 MintPulse NFT Marketplace
> **Next-Generation Production-Grade Web3 Decentralized NFT Marketplace**  
> Built with Solidity 0.8.28, Hardhat, Express, TypeScript, MySQL, Next.js 16 (Turbopack), and Ethers.js v6.
---
## 🌟 Key Features
### 📜 Smart Contracts & Web3 Protocol
- **ERC-721 & ERC-2981 Standard**: Full support for decentralized NFT minting with custom IPFS metadata URIs and automated creator secondary sale royalties (0% to 10%).
- **Instant Buy/Sell Marketplace**: Instant listing, price updating, listing cancellation, and automated 2.5% platform fee calculation.
- **Offers Engine**: Make, cancel, accept, and reject off-chain/on-chain offers with automatic escrow settlement.
- **Timed Auctions Engine**: Create timed auctions with minimum starting bids, automated outbid refunding, last-minute bid extensions, and auction settlement.
- **Security & Emergency Controls**: ReentrancyGuard, Ownable access controls, and emergency pause mechanism for marketplace safety.
### ⚙️ Backend API & Resilient Blockchain Indexer
- **Express + TypeScript + MySQL Architecture**: Production-ready clean architecture separated into Controllers, Services, Models, Routes, and Middlewares.
- **Wallet Signature Authentication**: Cryptographic nonce generation (`/api/auth/nonce`) and EIP-712 signature verification (`/api/auth/verify`) issuing JWT bearer tokens.
- **Resilient Event Indexer**: Historical block synchronization, real-time polling fallback, blockchain rollback/reorg detection, and duplicate event prevention using `transactionHash` + `logIndex` uniqueness constraints.
### 🎨 Frontend Web3 User Interface
- **Next.js 16 App Router (Turbopack)**: High-speed prerendered web application with 26 production routes.
- **Glassmorphism Aesthetic**: Vibrant dark-mode UI with subtle gradients, micro-animations, loading skeletons, and responsive layout for mobile and desktop.
- **Full Page Suite**:
  - 🏠 **Home Page (`/`)**: Hero section, platform volume stats, trending collections carousel, live marketplace drops.
  - 🔍 **Explore (`/explore`)**: Multi-category filter (Art, Gaming, Music, Collectibles), status filter, and price sorting.
  - 🖼️ **Collections (`/collections` & `/collection/[id]`)**: Collection directory, floor price tracking, owner percentage, item grid.
  - 💎 **NFT Detail (`/nft/[contract]/[tokenId]`)**: Asset display, trait properties, owner/creator badges, Buy Now modal, Make Offer & Place Bid modals, item activity timeline.
  - ⚡ **Mint NFT (`/mint`)**: Drag-and-drop file upload, IPFS CID metadata generation, creator royalty % setup, on-chain mint transaction trigger.
  - 👤 **User Profile (`/profile`)**: Wallet balance, owned items, received offers inbox, transaction history logs.
  - 📈 **Activity (`/activity`)**: Real-time global on-chain event stream.
  - 🏆 **Rankings (`/rankings`)**: Collection volume leaderboard.
  - ❤️ **Favorites (`/favorites`)**: User watchlist.
  - 🛡️ **Admin Panel (`/admin/*`)**: Management dashboard for user moderation, collection verification, financial fee monitoring, and emergency controls.
---
## 🏗️ Project Architecture
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              MintPulse Next.js 16 Frontend                             │
│                              http://localhost:3000                                     │
└───────────────────┬────────────────────────────────────────────────┬───────────────────┘
                    │                                                │
          REST API Client (`/lib/api.ts`)                    Web3 Provider (`/lib/contracts.ts`)
                    │                                                │
┌───────────────────▼───────────────────┐        ┌───────────────────▼───────────────────┐
│         Express Backend API           │        │        Hardhat Smart Contracts        │
│        http://localhost:5000          │        │     MintPulseNFT & Marketplace        │
└───────────────────┬───────────────────┘        └───────────────────┬───────────────────┘
                    │                                                │
                    └────────── Real-Time Event Indexing ────────────┘
```
---
## 📂 Directory Structure
```text
mintpulsenft-marketplace/
├── contracts/                  # Solidity Smart Contracts & Hardhat Environment
│   ├── contracts/
│   │   ├── MintPulseNFT.sol          # ERC-721 + ERC-2981 NFT Contract
│   │   ├── MintPulseMarketplace.sol  # Marketplace Protocol (Listings, Offers, Auctions)
│   │   ├── interfaces/               # Solidity Contract Interfaces
│   │   └── libraries/                # MarketplaceTypes.sol Library
│   ├── test/                         # 44/44 Passing Hardhat Test Suites
│   ├── scripts/                      # Deployment & E2E Demonstration Scripts
│   └── deployments/                  # Deployed Contract Addresses JSON
│
├── backend/                    # Node.js, Express, TypeScript Backend API
│   ├── src/
│   │   ├── config/                   # Env, Database, Blockchain & Contract Configs
│   │   ├── controllers/              # REST Controller Endpoints
│   │   ├── services/                 # Business Logic & Database Services
│   │   ├── routes/                   # Express API Router Modules
│   │   ├── middleware/               # Auth JWT, Rate Limit, Error Middlewares
│   │   └── indexer/                  # Real-Time Blockchain Event Indexer
│   └── scripts/                      # Health Check & ABI Sync Scripts
│
└── frontend/                   # Next.js 16 Web3 App Router Frontend
    ├── src/
    │   ├── app/                      # Next.js 16 Production Routes (26 Routes)
    │   ├── components/               # Glassmorphic UI Components
    │   ├── lib/                      # Ethers.js & Backend API Clients
    │   ├── constants/                # Contract ABIs & Addresses
    │   └── utils/                    # Price & Address Formatting Utilities
    └── public/                       # Assets & Media
```
---
## 🛠️ Quick Start & Local Setup
### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**
- **MySQL Database**: Running locally on port 3306
---
### 1. Smart Contracts Setup
```bash
cd contracts
# Install dependencies
npm install
# Run Hardhat test suite (44/44 Tests Pass)
npx hardhat test
# Run E2E Lifecycle Demo (Mint -> List -> Buy -> Payout Settlement)
npx hardhat run scripts/e2e-demo.ts
```
---
### 2. Backend Setup
```bash
cd backend
# Install dependencies
npm install
# Start Express Backend Server (Port 5000)
npm start
```
*The backend will automatically connect to MySQL, load contract bindings, and start real-time event indexing.*
---
### 3. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install
# Start Next.js Development Server (Port 3000)
npm run dev
```
*Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.*
---
## 📊 API Reference
|
 Method 
|
 Endpoint 
|
 Description 
|
 Auth 
|
|
------
|
--------
|
-----------
|
----
|
|
`GET`
|
`/health`
|
 Server & Database Health Status 
|
 Public 
|
|
`POST`
|
`/api/auth/nonce`
|
 Generate Nonce for Wallet Sign-in 
|
 Public 
|
|
`POST`
|
`/api/auth/verify`
|
 Verify Wallet Signature & Issue JWT 
|
 Public 
|
|
`GET`
|
`/api/auth/me`
|
 Retrieve Authenticated User Profile 
|
 JWT 
|
|
`GET`
|
`/api/nfts`
|
 Get Filtered NFT Catalog 
|
 Public 
|
|
`GET`
|
`/api/listings`
|
 Get Active Marketplace Listings 
|
 Public 
|
|
`POST`
|
`/api/listings`
|
 Create On-Chain Marketplace Listing 
|
 JWT 
|
|
`POST`
|
`/api/offers`
|
 Submit Offer for NFT 
|
 JWT 
|
|
`POST`
|
`/api/auctions`
|
 Create Timed Auction 
|
 JWT 
|
|
`GET`
|
`/api/activities`
|
 Get Real-Time Global Event Stream 
|
 Public 
|
|
`GET`
|
`/api/analytics/stats`
|
 Get Platform Volume & Fee Analytics 
|
 Public 
|
|
`GET`
|
`/api/admin/users`
|
 Admin User Management 
|
 Admin JWT 
|
---
## 🧪 Testing Results Summary
- **Smart Contract Test Coverage**: 44 / 44 Mocha Tests **100% PASS**.
- **Frontend Production Build**: 26 / 26 App Router Routes **100% Clean Pass** (`npm run build`).
- **End-to-End Financial Settlement**:
  - Sale Price: `1.0 ETH`
  - Platform Fee (2.5%): `+0.025 ETH` → Fee Receiver
  - Creator Royalty (5.0%): `+0.05 ETH` → Original Creator
  - Net Seller Payout (92.5%): `+0.925 ETH` → Seller
---
## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.
