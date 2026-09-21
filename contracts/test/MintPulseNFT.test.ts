import { expect } from "chai";
import { network } from "hardhat";

describe("MintPulseNFT", function () {

    async function deployFixture() {

        const { ethers } =
            await network.getOrCreate();

        const [owner, user] =
            await ethers.getSigners();

        const NFT =
            await ethers.getContractFactory(
                "MintPulseNFT"
            );

        const nft =
            await NFT.deploy(
                "MintPulse NFT",
                "MPNFT",
                owner.address,
                250
            );

        await nft.waitForDeployment();

        return {
            ethers,
            nft,
            owner,
            user
        };
    }

    describe("Deployment", function () {

        it("Should deploy successfully", async function () {

            const {
                nft,
                ethers
            } = await deployFixture();

            expect(
                await nft.getAddress()
            ).to.not.equal(
                ethers.ZeroAddress
            );

        });

        it("Should set correct owner", async function () {

            const {
                nft,
                owner
            } = await deployFixture();

            expect(
                await nft.owner()
            ).to.equal(
                owner.address
            );

        });

    });

describe("Minting", function () {

    it("Should mint an NFT successfully", async function () {

        const {
            nft,
            user
        } = await deployFixture();

        await nft.mintNFT(
            user.address,
            "ipfs://metadata/1.json"
        );

        expect(
            await nft.ownerOf(1)
        ).to.equal(
            user.address
        );

        expect(
            await nft.totalSupply()
        ).to.equal(1);

    });

    it("Should increase token ID after mint", async function () {

        const {
            nft,
            user
        } = await deployFixture();

        await nft.mintNFT(
            user.address,
            "ipfs://metadata/1.json"
        );

        await nft.mintNFT(
            user.address,
            "ipfs://metadata/2.json"
        );

        expect(
            await nft.currentTokenId()
        ).to.equal(2);

    });

    it("Should store creator correctly", async function () {

        const {
            nft,
            owner,
            user
        } = await deployFixture();

        await nft.mintNFT(
            user.address,
            "ipfs://metadata/1.json"
        );

        expect(
            await nft.creatorOf(1)
        ).to.equal(
            owner.address
        );

    });

});

describe("Validation", function () {

    it("Should revert when minting to zero address", async function () {

        const { nft, ethers } = await deployFixture();

        await expect(
            nft.mintNFT(
                ethers.ZeroAddress,
                "ipfs://metadata.json"
            )
        ).to.be.revertedWithCustomError(
            nft,
            "InvalidAddress"
        );

    });

    it("Should revert when token URI is empty", async function () {

        const { nft, user } = await deployFixture();

        await expect(
            nft.mintNFT(
                user.address,
                ""
            )
        ).to.be.revertedWithCustomError(
            nft,
            "EmptyTokenURI"
        );

    });

});

describe("Pause", function () {

    it("Owner should pause the contract", async function () {

        const { nft } = await deployFixture();

        await nft.pause();

        expect(
            await nft.isPaused()
        ).to.equal(true);

    });

    it("Should not allow minting while paused", async function () {

        const { nft, user } = await deployFixture();

        await nft.pause();

        await expect(
            nft.mintNFT(
                user.address,
                "ipfs://metadata.json"
            )
        ).to.be.revertedWithCustomError(
            nft,
            "EnforcedPause"
        );

    });

    it("Non-owner cannot pause", async function () {

        const { nft, user } = await deployFixture();

        await expect(
            nft.connect(user).pause()
        ).to.be.revertedWithCustomError(
            nft,
            "OwnableUnauthorizedAccount"
        );

    });

    it("Owner can unpause the contract", async function () {

        const { nft } = await deployFixture();

        await nft.pause();

        await nft.unpause();

        expect(
            await nft.isPaused()
        ).to.equal(false);

    });

});

});