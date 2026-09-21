import { expect } from "chai";
import { network } from "hardhat";

describe("Offers Flow", function () {
    async function deployFixture() {
        const { ethers } = await network.getOrCreate();
        const [owner, seller, buyer] = await ethers.getSigners();

        const NFT = await ethers.getContractFactory("MintPulseNFT");
        const nft = await NFT.deploy("MintPulse NFT", "MPNFT", owner.address, 250);
        await nft.waitForDeployment();

        const Marketplace = await ethers.getContractFactory("MintPulseMarketplace");
        const marketplace = await Marketplace.deploy(owner.address);
        await marketplace.waitForDeployment();

        await nft.mintNFT(seller.address, "https://ipfs.io/ipfs/bafybeig1");

        return { ethers, owner, seller, buyer, nft, marketplace };
    }

    it("Should make an offer successfully", async function () {
        const { buyer, nft, marketplace, ethers } = await deployFixture();
        const nftAddress = await nft.getAddress();

        await expect(
            marketplace.connect(buyer).makeOffer(nftAddress, 1, 86400, {
                value: ethers.parseEther("0.5"),
            })
        )
            .to.emit(marketplace, "OfferCreated")
            .withArgs(1, nftAddress, 1, buyer.address, ethers.parseEther("0.5"), (val: any) => val > 0);

        const offer = await marketplace.getOffer(1);
        expect(offer.offeror).to.equal(buyer.address);
        expect(offer.offerPrice).to.equal(ethers.parseEther("0.5"));
    });

    it("Should allow offeror to cancel offer and get refund", async function () {
        const { buyer, nft, marketplace, ethers } = await deployFixture();
        const nftAddress = await nft.getAddress();

        await marketplace.connect(buyer).makeOffer(nftAddress, 1, 86400, {
            value: ethers.parseEther("0.5"),
        });

        await expect(marketplace.connect(buyer).cancelOffer(1))
            .to.emit(marketplace, "OfferCancelled")
            .withArgs(1, buyer.address);

        const offer = await marketplace.getOffer(1);
        expect(offer.status).to.equal(3); // Cancelled
    });

    it("Should accept offer and transfer NFT to buyer", async function () {
        const { seller, buyer, nft, marketplace, ethers } = await deployFixture();
        const nftAddress = await nft.getAddress();
        const marketplaceAddress = await marketplace.getAddress();

        await nft.connect(seller).approve(marketplaceAddress, 1);
        await marketplace.connect(buyer).makeOffer(nftAddress, 1, 86400, {
            value: ethers.parseEther("0.5"),
        });

        await expect(marketplace.connect(seller).acceptOffer(1))
            .to.emit(marketplace, "OfferAccepted")
            .withArgs(1, seller.address, buyer.address, ethers.parseEther("0.5"));

        expect(await nft.ownerOf(1)).to.equal(buyer.address);
    });
});
