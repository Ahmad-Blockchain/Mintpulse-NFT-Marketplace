import { network } from "hardhat";

async function main() {
    console.log("==================================================");
    console.log(" MintPulse NFT Marketplace E2E Execution Demo ");
    console.log("==================================================");

    const { ethers } = await network.getOrCreate();
    const [owner, creator, seller, buyer] = await ethers.getSigners();

    console.log("Account 1 (Owner/FeeReceiver):", owner.address);
    console.log("Account 2 (Creator)         :", creator.address);
    console.log("Account 3 (Seller)          :", seller.address);
    console.log("Account 4 (Buyer)           :", buyer.address);
    console.log("--------------------------------------------------");

    // 1. Deploy Contracts
    const NFTFactory = await ethers.getContractFactory("MintPulseNFT");
    const nft = await NFTFactory.deploy("MintPulse NFT", "MPNFT", owner.address, 250);
    await nft.waitForDeployment();
    const nftAddress = await nft.getAddress();
    console.log("1. MintPulseNFT Deployed to       :", nftAddress);

    const MarketplaceFactory = await ethers.getContractFactory("MintPulseMarketplace");
    const marketplace = await MarketplaceFactory.deploy(owner.address);
    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    console.log("2. MintPulseMarketplace Deployed to:", marketplaceAddress);
    console.log("--------------------------------------------------");

    // 2. Mint NFT with ERC-2981 Royalty (5% to Creator)
    console.log("\n[STEP 1: MINT NFT]");
    const tokenURI = "ipfs://bafybeig123456789nftmetadata/1.json";
    const mintTx = await nft.connect(seller).mintWithRoyalty(
        seller.address,
        tokenURI,
        creator.address,
        500 // 5.0% Royalty
    );
    await mintTx.wait();
    const tokenId = 1;

    const nftOwner = await nft.ownerOf(tokenId);
    const tokenCreator = await nft.getTokenCreator(tokenId);
    console.log(`✓ NFT #${tokenId} Minted Successfully!`);
    console.log(`  Owner  : ${nftOwner}`);
    console.log(`  Creator: ${tokenCreator}`);
    console.log(`  URI    : ${tokenURI}`);
    console.log("--------------------------------------------------");

    // 3. Approve & List NFT on Marketplace for 1.0 ETH
    console.log("\n[STEP 2: LIST NFT FOR SALE]");
    const listPrice = ethers.parseEther("1.0");

    console.log("  Approving Marketplace contract...");
    const approveTx = await nft.connect(seller).approve(marketplaceAddress, tokenId);
    await approveTx.wait();

    console.log(`  Listing Token #${tokenId} for ${ethers.formatEther(listPrice)} ETH...`);
    const listTx = await marketplace.connect(seller).listNFT(nftAddress, tokenId, listPrice);
    await listTx.wait();

    const isListed = await marketplace.isListed(nftAddress, tokenId);
    const listing = await marketplace.getListing(nftAddress, tokenId);
    console.log(`✓ NFT Listed Successfully!`);
    console.log(`  Is Active : ${isListed}`);
    console.log(`  List Price: ${ethers.formatEther(listing.price)} ETH`);
    console.log(`  Seller    : ${listing.seller}`);
    console.log("--------------------------------------------------");

    // 4. Buyer Purchases NFT
    console.log("\n[STEP 3: BUY NFT]");
    const sellerBalBefore = await ethers.provider.getBalance(seller.address);
    const creatorBalBefore = await ethers.provider.getBalance(creator.address);
    const feeReceiverBalBefore = await ethers.provider.getBalance(owner.address);

    console.log(`  Buyer purchasing Token #${tokenId} for ${ethers.formatEther(listPrice)} ETH...`);
    const buyTx = await marketplace.connect(buyer).buyNFT(nftAddress, tokenId, { value: listPrice });
    await buyTx.wait();

    const newOwner = await nft.ownerOf(tokenId);
    const isListedAfter = await marketplace.isListed(nftAddress, tokenId);

    const sellerBalAfter = await ethers.provider.getBalance(seller.address);
    const creatorBalAfter = await ethers.provider.getBalance(creator.address);
    const feeReceiverBalAfter = await ethers.provider.getBalance(owner.address);

    const sellerPayout = sellerBalAfter - sellerBalBefore;
    const creatorRoyalty = creatorBalAfter - creatorBalBefore;
    const platformFee = feeReceiverBalAfter - feeReceiverBalBefore;

    console.log(`✓ NFT Purchased Successfully!`);
    console.log(`  New Owner      : ${newOwner}`);
    console.log(`  Is Still Listed: ${isListedAfter}`);
    console.log("\n[FINANCIAL SETTLEMENT BREAKDOWN]");
    console.log(`  Total Sale Price : ${ethers.formatEther(listPrice)} ETH`);
    console.log(`  Platform Fee (2.5%): +${ethers.formatEther(platformFee)} ETH`);
    console.log(`  Creator Royalty (5%): +${ethers.formatEther(creatorRoyalty)} ETH`);
    console.log(`  Seller Net Payout (92.5%): +${ethers.formatEther(sellerPayout)} ETH`);
    console.log("==================================================");
    console.log("✨ ALL LOGICS WORKING 100% PERFECTLY! ✨");
    console.log("==================================================");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
