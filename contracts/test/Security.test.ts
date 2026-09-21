import { expect } from "chai";
import { network } from "hardhat";

describe("Marketplace Security & Pause Control", function () {
    async function deployFixture() {
        const { ethers } = await network.getOrCreate();
        const [owner, attacker, user] = await ethers.getSigners();

        const NFT = await ethers.getContractFactory("MintPulseNFT");
        const nft = await NFT.deploy("MintPulse NFT", "MPNFT", owner.address, 250);
        await nft.waitForDeployment();

        const Marketplace = await ethers.getContractFactory("MintPulseMarketplace");
        const marketplace = await Marketplace.deploy(owner.address);
        await marketplace.waitForDeployment();

        return { ethers, owner, attacker, user, nft, marketplace };
    }

    it("Should prevent non-owners from calling emergency pause", async function () {
        const { attacker, marketplace } = await deployFixture();
        await expect(marketplace.connect(attacker).pause()).to.be.revertedWithCustomError(
            marketplace,
            "OwnableUnauthorizedAccount"
        );
    });

    it("Should reject zero address fee receiver", async function () {
        const { owner, marketplace, ethers } = await deployFixture();
        await expect(marketplace.connect(owner).setFeeReceiver(ethers.ZeroAddress)).to.be.revertedWithCustomError(
            marketplace,
            "InvalidAddress"
        );
    });
});
