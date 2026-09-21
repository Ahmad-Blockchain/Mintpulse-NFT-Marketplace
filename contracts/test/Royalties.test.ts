import { expect } from "chai";
import { network } from "hardhat";

describe("ERC-2981 Royalties Flow", function () {
    async function deployFixture() {
        const { ethers } = await network.getOrCreate();
        const [owner, creator, seller, buyer] = await ethers.getSigners();

        const NFT = await ethers.getContractFactory("MintPulseNFT");
        const nft = await NFT.deploy("MintPulse NFT", "MPNFT", owner.address, 250);
        await nft.waitForDeployment();

        const Marketplace = await ethers.getContractFactory("MintPulseMarketplace");
        const marketplace = await Marketplace.deploy(owner.address);
        await marketplace.waitForDeployment();

        await nft.mintWithRoyalty(seller.address, "https://ipfs.io/ipfs/bafybeig1", creator.address, 500); // 5% royalty

        return { ethers, owner, creator, seller, buyer, nft, marketplace };
    }

    it("Should calculate and pay royalties on marketplace sale", async function () {
        const { creator, seller, buyer, nft, marketplace, ethers } = await deployFixture();
        const nftAddress = await nft.getAddress();
        const marketplaceAddress = await marketplace.getAddress();

        await nft.connect(seller).approve(marketplaceAddress, 1);
        await marketplace.connect(seller).listNFT(nftAddress, 1, ethers.parseEther("1.0"));

        const creatorBalBefore = await ethers.provider.getBalance(creator.address);

        await marketplace.connect(buyer).buyNFT(nftAddress, 1, { value: ethers.parseEther("1.0") });

        const creatorBalAfter = await ethers.provider.getBalance(creator.address);
        expect(creatorBalAfter - creatorBalBefore).to.equal(ethers.parseEther("0.05")); // 5% of 1 ETH
    });
});
