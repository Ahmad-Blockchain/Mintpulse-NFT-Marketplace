// ==========================================================
// MintPulse Marketplace Event Listener
// ==========================================================

import {
    marketplaceContract
} from "../contracts/contracts.js";

import {
    EventService
} from "../services/event.service.js";

import {
    BlockchainEventService
} from "../services/blockchainEvent.service.js";

// ==========================================================
// Start Marketplace Events
// ==========================================================

export function startMarketplaceEvents(): void {

    console.log(
        "Marketplace Event Listener Started"
    );

    // ======================================================
    // NFT Listed
    // ======================================================

    marketplaceContract.on(
        "NFTListed",
        async (
            tokenId,
            nftContractAddress,
            seller,
            price,
            event
        ) => {

            const transactionHash =
                event.log.transactionHash;

            const logIndex =
                Number(event.log.index);

            try {

                const processed =
                    await BlockchainEventService.isProcessed(
                        transactionHash,
                        logIndex
                    );

                if (processed) {

                    console.log(
                        `[EVENT] NFTListed duplicate skipped: ${transactionHash}:${logIndex}`
                    );

                    return;

                }

                const marketplaceAddress =
                    await marketplaceContract.getAddress();

                const priceString =
                    price.toString();

                console.log("");
                console.log(
                    "================================="
                );
                console.log(
                    "NFT Listed Event"
                );
                console.log(
                    "================================="
                );

                console.log(
                    "Token   :",
                    tokenId.toString()
                );

                console.log(
                    "NFT     :",
                    nftContractAddress
                );

                console.log(
                    "Seller  :",
                    seller
                );

                console.log(
                    "Price   :",
                    priceString
                );

                console.log(
                    "TX Hash :",
                    transactionHash
                );

                console.log(
                    "Block   :",
                    event.log.blockNumber
                );

                console.log(
                    "Log     :",
                    logIndex
                );

                await EventService.handleNFTListed(

                    Number(tokenId),

                    nftContractAddress,

                    seller,

                    priceString,

                    transactionHash

                );

                await BlockchainEventService.saveProcessedEvent(

                    "NFTListed",

                    transactionHash,

                    Number(event.log.blockNumber),

                    logIndex,

                    marketplaceAddress

                );

                console.log(
                    "Listing + Transaction saved to MySQL"
                );

                console.log("");

            } catch (error) {

                console.error(
                    "NFTListed Event Error:",
                    error
                );

            }

        }
    );

    // ======================================================
    // NFT Sold
    // ======================================================

    marketplaceContract.on(
        "NFTSold",
        async (
            tokenId,
            buyer,
            price,
            event
        ) => {

            const transactionHash =
                event.log.transactionHash;

            const logIndex =
                Number(event.log.index);

            try {

                const processed =
                    await BlockchainEventService.isProcessed(
                        transactionHash,
                        logIndex
                    );

                if (processed) {

                    console.log(
                        `[EVENT] NFTSold duplicate skipped: ${transactionHash}:${logIndex}`
                    );

                    return;

                }

                const marketplaceAddress =
                    await marketplaceContract.getAddress();

                const priceString =
                    price.toString();

                console.log("");
                console.log(
                    "================================="
                );
                console.log(
                    "NFT Sold Event"
                );
                console.log(
                    "================================="
                );

                console.log(
                    "Token   :",
                    tokenId.toString()
                );

                console.log(
                    "Buyer   :",
                    buyer
                );

                console.log(
                    "Price   :",
                    priceString
                );

                console.log(
                    "TX Hash :",
                    transactionHash
                );

                console.log(
                    "Block   :",
                    event.log.blockNumber
                );

                console.log(
                    "Log     :",
                    logIndex
                );

                await EventService.handleNFTSold(

                    Number(tokenId),

                    buyer,

                    priceString,

                    transactionHash

                );

                await BlockchainEventService.saveProcessedEvent(

                    "NFTSold",

                    transactionHash,

                    Number(event.log.blockNumber),

                    logIndex,

                    marketplaceAddress

                );

                console.log(
                    "Sale + Transaction saved to MySQL"
                );

                console.log("");

            } catch (error) {

                console.error(
                    "NFTSold Event Error:",
                    error
                );

            }

        }
    );

}