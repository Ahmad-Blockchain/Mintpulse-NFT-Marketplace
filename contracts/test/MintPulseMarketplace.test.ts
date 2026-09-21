import { expect } from "chai";
import { network } from "hardhat";

describe("MintPulseMarketplace", function () {

    async function deployFixture() {

        const { ethers } =
            await network.getOrCreate();

        const [
            owner,
            seller,
            buyer
        ] = await ethers.getSigners();

        // =====================================================
        // Deploy NFT
        // =====================================================

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

        // =====================================================
        // Deploy Marketplace
        // =====================================================

        const Marketplace =
            await ethers.getContractFactory(
                "MintPulseMarketplace"
            );

        const marketplace =
            await Marketplace.deploy(
                owner.address
            );

        await marketplace.waitForDeployment();
        
        await marketplace.setPlatformFee(250);

        // =====================================================
        // Connect Contracts
        // =====================================================

        await nft.setMarketplace(
            await marketplace.getAddress()
        );

        return {

            ethers,

            owner,

            seller,

            buyer,

            nft,

            marketplace

        };

    }

    // =====================================================
    // Deployment Tests
    // =====================================================

    describe("Deployment", function () {

        it("Should deploy marketplace successfully", async function () {

            const {
                marketplace,
                ethers
            } = await deployFixture();

            expect(
                await marketplace.getAddress()
            ).to.not.equal(
                ethers.ZeroAddress
            );

        });

        it("Should set correct owner", async function () {

            const {
                marketplace,
                owner
            } = await deployFixture();

            expect(
                await marketplace.owner()
            ).to.equal(
                owner.address
            );

        });

    });

describe("Listing", function () {

    it("Should list NFT successfully", async function () {

        const {
            nft,
            marketplace,
            seller
        } = await deployFixture();

        await nft.mintNFT(
            seller.address,
            "ipfs://metadata/1.json"
        );

        await nft.connect(seller).approve(
            await marketplace.getAddress(),
            1
        );

        await marketplace.connect(seller).listNFT(
            await nft.getAddress(),
            1,
            1000n
        );

        const listing =
            await marketplace.getListing(
                await nft.getAddress(),
                1
            );

        expect(
            await marketplace.isListed(await nft.getAddress(), 1)
        ).to.equal(true);

        expect(
            listing.price
        ).to.equal(1000n);

        expect(
            listing.seller
        ).to.equal(
            seller.address
        );

    });

    it("Should revert when price is zero", async function () {

        const {
            nft,
            marketplace,
            seller
        } = await deployFixture();

        await nft.mintNFT(
            seller.address,
            "ipfs://metadata/1.json"
        );

        await nft.connect(seller).approve(
            await marketplace.getAddress(),
            1
        );

        await expect(

            marketplace.connect(seller).listNFT(
                await nft.getAddress(),
                1,
                0
            )

        ).to.be.revertedWithCustomError(
            marketplace,
            "InvalidPrice"
        );

    });

    it("Should revert for zero NFT address", async function () {

        const {
            marketplace,
            seller,
            ethers
        } = await deployFixture();

        await expect(

            marketplace.connect(seller).listNFT(
                ethers.ZeroAddress,
                1,
                1000
            )

        ).to.be.revertedWithCustomError(
            marketplace,
            "InvalidAddress"
        );

    });

    it("Should not allow listing the same NFT twice", async function () {

    const {
        nft,
        marketplace,
        seller
    } = await deployFixture();

    await nft.mintNFT(
        seller.address,
        "ipfs://metadata/1.json"
    );

    await nft.connect(seller).approve(
        await marketplace.getAddress(),
        1
    );

    await marketplace.connect(seller).listNFT(
        await nft.getAddress(),
        1,
        1000n
    );

    await expect(

        marketplace.connect(seller).listNFT(
            await nft.getAddress(),
            1,
            1000n
        )

    ).to.be.revertedWithCustomError(
        marketplace,
        "AlreadyListed"
    );

});

it("Should not allow non-owner to list NFT", async function () {

    const {
        nft,
        marketplace,
        seller,
        buyer
    } = await deployFixture();

    await nft.mintNFT(
        seller.address,
        "ipfs://metadata/1.json"
    );

    await nft.connect(seller).approve(
        await marketplace.getAddress(),
        1
    );

    await expect(

        marketplace.connect(buyer).listNFT(
            await nft.getAddress(),
            1,
            1000n
        )

    ).to.be.revertedWithCustomError(
        marketplace,
        "NotOwner"
    );

});

it("Should require NFT approval before listing", async function () {

    const {
        nft,
        marketplace,
        seller
    } = await deployFixture();

    await nft.mintNFT(
        seller.address,
        "ipfs://metadata/1.json"
    );

    await expect(

        marketplace.connect(seller).listNFT(
            await nft.getAddress(),
            1,
            1000n
        )

    ).to.be.revertedWithCustomError(
        marketplace,
        "TransferFailed"
    );

});

it("Should increase total listings", async function () {

    const {
        nft,
        marketplace,
        seller
    } = await deployFixture();

    await nft.mintNFT(
        seller.address,
        "ipfs://metadata/1.json"
    );

    await nft.connect(seller).approve(
        await marketplace.getAddress(),
        1
    );

    await marketplace.connect(seller).listNFT(
        await nft.getAddress(),
        1,
        1000n
    );

    expect(
        await marketplace.totalListings()
    ).to.equal(1);

});

it("Should emit NFTListed event", async function () {

    const {
        nft,
        marketplace,
        seller
    } = await deployFixture();

    await nft.mintNFT(
        seller.address,
        "ipfs://metadata/1.json"
    );

    await nft.connect(seller).approve(
        await marketplace.getAddress(),
        1
    );

    await expect(

        marketplace.connect(seller).listNFT(
            await nft.getAddress(),
            1,
            1000n
        )

    ).to.emit(
        marketplace,
        "NFTListed"
    );

});

});

// =====================================================
// Marketplace Management
// =====================================================

describe("Management", function () {

    it("Should cancel listing successfully", async function () {

        const {
            nft,
            marketplace,
            seller
        } = await deployFixture();

        await nft.mintNFT(
            seller.address,
            "ipfs://metadata/1.json"
        );

        await nft.connect(seller).approve(
            await marketplace.getAddress(),
            1
        );

        await marketplace.connect(seller).listNFT(
            await nft.getAddress(),
            1,
            1000n
        );

        await marketplace.connect(seller).cancelListing(
            await nft.getAddress(),
            1
        );

        const listing =
            await marketplace.getListing(
                await nft.getAddress(),
                1
            );

        expect(
            await marketplace.isListed(await nft.getAddress(), 1)
        ).to.equal(false);

    });

    it("Should not allow non-owner to cancel listing", async function () {

        const {
            nft,
            marketplace,
            seller,
            buyer
        } = await deployFixture();

        await nft.mintNFT(
            seller.address,
            "ipfs://metadata/1.json"
        );

        await nft.connect(seller).approve(
            await marketplace.getAddress(),
            1
        );

        await marketplace.connect(seller).listNFT(
            await nft.getAddress(),
            1,
            1000n
        );

        await expect(

            marketplace.connect(buyer).cancelListing(
                await nft.getAddress(),
                1
            )

        ).to.be.revertedWithCustomError(
            marketplace,
            "NotOwner"
        );

    });

    it("Should revert when listing is not active", async function () {

        const {
            nft,
            marketplace,
            seller
        } = await deployFixture();

        await nft.mintNFT(
            seller.address,
            "ipfs://metadata/1.json"
        );

        await expect(

            marketplace.connect(seller).cancelListing(
                await nft.getAddress(),
                1
            )

        ).to.be.revertedWithCustomError(
            marketplace,
            "NotListed"
        );

    });

    it("Should update listing price successfully", async function () {

        const {
            nft,
            marketplace,
            seller
        } = await deployFixture();

        await nft.mintNFT(
            seller.address,
            "ipfs://metadata/1.json"
        );

        await nft.connect(seller).approve(
            await marketplace.getAddress(),
            1
        );

        await marketplace.connect(seller).listNFT(
            await nft.getAddress(),
            1,
            1000n
        );

        await marketplace.connect(seller).updateListingPrice(
            await nft.getAddress(),
            1,
            2500n
        );

        const listing =
            await marketplace.getListing(
                await nft.getAddress(),
                1
            );

        expect(
            listing.price
        ).to.equal(2500n);

    });

    it("Should reject zero price update", async function () {

        const {
            nft,
            marketplace,
            seller
        } = await deployFixture();

        await nft.mintNFT(
            seller.address,
            "ipfs://metadata/1.json"
        );

        await nft.connect(seller).approve(
            await marketplace.getAddress(),
            1
        );

        await marketplace.connect(seller).listNFT(
            await nft.getAddress(),
            1,
            1000n
        );

        await expect(

            marketplace.connect(seller).updateListingPrice(
                await nft.getAddress(),
                1,
                0
            )

        ).to.be.revertedWithCustomError(
            marketplace,
            "InvalidPrice"
        );

    });

});

// =====================================================
// Purchase
// =====================================================

describe("Purchase", function () {

    it("Should buy NFT successfully", async function () {

        const {
            nft,
            marketplace,
            seller,
            buyer,
            ethers
        } = await deployFixture();

        await nft.mintNFT(
            seller.address,
            "ipfs://metadata/1.json"
        );

        await nft.connect(seller).approve(
            await marketplace.getAddress(),
            1
        );

        const price = ethers.parseEther("1");

        await marketplace.connect(seller).listNFT(
            await nft.getAddress(),
            1,
            price
        );

        await marketplace.connect(buyer).buyNFT(
            await nft.getAddress(),
            1,
            {
                value: price
            }
        );

        expect(
            await nft.ownerOf(1)
        ).to.equal(
            buyer.address
        );

    });

    it("Should increase total sales", async function () {

        const {
            nft,
            marketplace,
            seller,
            buyer,
            ethers
        } = await deployFixture();

        await nft.mintNFT(
            seller.address,
            "ipfs://metadata/1.json"
        );

        await nft.connect(seller).approve(
            await marketplace.getAddress(),
            1
        );

        const price =
            ethers.parseEther("1");

        await marketplace.connect(seller).listNFT(
            await nft.getAddress(),
            1,
            price
        );

        await marketplace.connect(buyer).buyNFT(
            await nft.getAddress(),
            1,
            {
                value: price
            }
        );

        expect(
            await marketplace.totalSales()
        ).to.equal(1);

    });

    it("Should remove listing after purchase", async function () {

        const {
            nft,
            marketplace,
            seller,
            buyer,
            ethers
        } = await deployFixture();

        await nft.mintNFT(
            seller.address,
            "ipfs://metadata/1.json"
        );

        await nft.connect(seller).approve(
            await marketplace.getAddress(),
            1
        );

        const price =
            ethers.parseEther("1");

        await marketplace.connect(seller).listNFT(
            await nft.getAddress(),
            1,
            price
        );

        await marketplace.connect(buyer).buyNFT(
            await nft.getAddress(),
            1,
            {
                value: price
            }
        );

        const listing =
            await marketplace.getListing(
                await nft.getAddress(),
                1
            );

        expect(
            await marketplace.isListed(await nft.getAddress(), 1)
        ).to.equal(false);

    });

    it("Should revert for incorrect payment", async function () {

    const {
        nft,
        marketplace,
        seller,
        buyer,
        ethers
    } = await deployFixture();

    await nft.mintNFT(
        seller.address,
        "ipfs://metadata/1.json"
    );

    await nft.connect(seller).approve(
        await marketplace.getAddress(),
        1
    );

    const price =
        ethers.parseEther("1");

    await marketplace.connect(seller).listNFT(
        await nft.getAddress(),
        1,
        price
    );

    await expect(

        marketplace.connect(buyer).buyNFT(
            await nft.getAddress(),
            1,
            {
                value:
                    ethers.parseEther("0.5")
            }
        )

    ).to.be.revertedWithCustomError(
        marketplace,
        "IncorrectPayment"
    );

});

it("Should revert when NFT is not listed", async function () {

    const {
        nft,
        marketplace,
        seller,
        buyer,
        ethers
    } = await deployFixture();

    await nft.mintNFT(
        seller.address,
        "ipfs://metadata/1.json"
    );

    await expect(

        marketplace.connect(buyer).buyNFT(
            await nft.getAddress(),
            1,
            {
                value:
                    ethers.parseEther("1")
            }
        )

    ).to.be.revertedWithCustomError(
        marketplace,
        "NotListed"
    );

});

it("Should emit NFTSold event", async function () {

    const {
        nft,
        marketplace,
        seller,
        buyer,
        ethers
    } = await deployFixture();

    await nft.mintNFT(
        seller.address,
        "ipfs://metadata/1.json"
    );

    await nft.connect(seller).approve(
        await marketplace.getAddress(),
        1
    );

    const price =
        ethers.parseEther("1");

    await marketplace.connect(seller).listNFT(
        await nft.getAddress(),
        1,
        price
    );

    await expect(

        marketplace.connect(buyer).buyNFT(
            await nft.getAddress(),
            1,
            {
                value: price
            }
        )

    ).to.emit(
        marketplace,
        "NFTSold"
    );

});

it("Should not allow buying NFT twice", async function () {

    const {
        nft,
        marketplace,
        seller,
        buyer,
        ethers
    } = await deployFixture();

    await nft.mintNFT(
        seller.address,
        "ipfs://metadata/1.json"
    );

    await nft.connect(seller).approve(
        await marketplace.getAddress(),
        1
    );

    const price =
        ethers.parseEther("1");

    await marketplace.connect(seller).listNFT(
        await nft.getAddress(),
        1,
        price
    );

    await marketplace.connect(buyer).buyNFT(
        await nft.getAddress(),
        1,
        {
            value: price
        }
    );

    await expect(

        marketplace.connect(buyer).buyNFT(
            await nft.getAddress(),
            1,
            {
                value: price
            }
        )

    ).to.be.revertedWithCustomError(
        marketplace,
        "NotListed"
    );

});

it("Should transfer NFT ownership to buyer", async function () {

    const {
        nft,
        marketplace,
        seller,
        buyer,
        ethers
    } = await deployFixture();

    const price = ethers.parseEther("1");

    await nft.mintNFT(
        seller.address,
        "ipfs://metadata/1.json"
    );

    await nft.connect(seller).approve(
        await marketplace.getAddress(),
        1
    );

    await marketplace.connect(seller).listNFT(
        await nft.getAddress(),
        1,
        price
    );

    await marketplace.connect(buyer).buyNFT(
        await nft.getAddress(),
        1,
        { value: price }
    );

    expect(
        await nft.ownerOf(1)
    ).to.equal(
        buyer.address
    );

});

it("Should pay the seller", async function () {

    const {
        nft,
        marketplace,
        seller,
        buyer,
        ethers
    } = await deployFixture();

    const price = ethers.parseEther("1");

    await nft.mintNFT(
        seller.address,
        "ipfs://metadata/1.json"
    );

    await nft.connect(seller).approve(
        await marketplace.getAddress(),
        1
    );

    await marketplace.connect(seller).listNFT(
        await nft.getAddress(),
        1,
        price
    );

    const sellerBalanceBefore =
        await ethers.provider.getBalance(
            seller.address
        );

    await marketplace.connect(buyer).buyNFT(
        await nft.getAddress(),
        1,
        {
            value: price
        }
    );

    const sellerBalanceAfter =
        await ethers.provider.getBalance(
            seller.address
        );

    expect(
        sellerBalanceAfter
    ).to.be.greaterThan(
        sellerBalanceBefore
    );

});

it("Should increase marketplace total sales", async function () {

    const {
        nft,
        marketplace,
        seller,
        buyer,
        ethers
    } = await deployFixture();

    const price =
        ethers.parseEther("1");

    await nft.mintNFT(
        seller.address,
        "ipfs://metadata/1.json"
    );

    await nft.connect(seller).approve(
        await marketplace.getAddress(),
        1
    );

    await marketplace.connect(seller).listNFT(
        await nft.getAddress(),
        1,
        price
    );

    await marketplace.connect(buyer).buyNFT(
        await nft.getAddress(),
        1,
        {
            value: price
        }
    );

    expect(
        await marketplace.totalSales()
    ).to.equal(1);

});

});

})