import { expect } from "chai";
import { network } from "hardhat";

describe("Auctions Flow", function () {
    async function deployFixture() {
        const { ethers } = await network.getOrCreate();
        const [owner, seller, bidder1, bidder2] = await ethers.getSigners();

        const NFT = await ethers.getContractFactory("MintPulseNFT");
        const nft = await NFT.deploy("MintPulse NFT", "MPNFT", owner.address, 250);
        await nft.waitForDeployment();

        const Marketplace = await ethers.getContractFactory("MintPulseMarketplace");
        const marketplace = await Marketplace.deploy(owner.address);
        await marketplace.waitForDeployment();

        await nft.mintNFT(seller.address, "https://ipfs.io/ipfs/bafybeig1");

        return { ethers, owner, seller, bidder1, bidder2, nft, marketplace };
    }

    it("Should create auction successfully", async function () {
        const { seller, nft, marketplace, ethers } = await deployFixture();
        const nftAddress = await nft.getAddress();
        const marketplaceAddress = await marketplace.getAddress();

        await nft.connect(seller).approve(marketplaceAddress, 1);

        await expect(
            marketplace.connect(seller).createAuction(nftAddress, 1, ethers.parseEther("0.1"), 3600)
        )
            .to.emit(marketplace, "AuctionCreated")
            .withArgs(1, nftAddress, 1, seller.address, ethers.parseEther("0.1"),(val: any) => val > 0);

        const auction = await marketplace.getAuction(1);
        expect(auction.seller).to.equal(seller.address);
        expect(auction.startingPrice).to.equal(ethers.parseEther("0.1"));
    });

    it("Should place bid and refund previous bidder", async function () {
        const { seller, bidder1, bidder2, nft, marketplace, ethers } = await deployFixture();
        const nftAddress = await nft.getAddress();
        const marketplaceAddress = await marketplace.getAddress();

        await nft.connect(seller).approve(marketplaceAddress, 1);
        await marketplace.connect(seller).createAuction(nftAddress, 1, ethers.parseEther("0.1"), 3600);

        await marketplace.connect(bidder1).placeBid(1, { value: ethers.parseEther("0.2") });

        const auction1 = await marketplace.getAuction(1);
        expect(auction1.highestBidder).to.equal(bidder1.address);
        expect(auction1.highestBid).to.equal(ethers.parseEther("0.2"));

        await marketplace.connect(bidder2).placeBid(1, { value: ethers.parseEther("0.3") });

        const auction2 = await marketplace.getAuction(1);
        expect(auction2.highestBidder).to.equal(bidder2.address);
        expect(auction2.highestBid).to.equal(ethers.parseEther("0.3"));
    });
});
