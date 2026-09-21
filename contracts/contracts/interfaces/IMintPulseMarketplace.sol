// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../libraries/MarketplaceTypes.sol";

interface IMintPulseMarketplace {
    // Events
    event NFTListed(uint256 indexed tokenId, address indexed nftContract, address indexed seller, uint256 price);
    event NFTSold(uint256 indexed tokenId, address indexed buyer, uint256 price);
    event ListingCancelled(uint256 indexed tokenId, address indexed seller);
    event ListingUpdated(uint256 indexed tokenId, uint256 newPrice);
    
    event OfferCreated(uint256 indexed offerId, address indexed nftContract, uint256 indexed tokenId, address offeror, uint256 price, uint256 expiresAt);
    event OfferCancelled(uint256 indexed offerId, address indexed offeror);
    event OfferAccepted(uint256 indexed offerId, address indexed seller, address indexed buyer, uint256 price);
    
    event AuctionCreated(uint256 indexed auctionId, address indexed nftContract, uint256 indexed tokenId, address seller, uint256 startingPrice, uint256 endTime);
    event BidPlaced(uint256 indexed auctionId, address indexed bidder, uint256 amount);
    event AuctionEnded(uint256 indexed auctionId, address indexed winner, uint256 amount);
    event AuctionCancelled(uint256 indexed auctionId, address indexed seller);

    // Listing Functions
    function listNFT(address nftContract, uint256 tokenId, uint256 price) external;
    function cancelListing(address nftContract, uint256 tokenId) external;
    function updateListingPrice(address nftContract, uint256 tokenId, uint256 newPrice) external;
    function buyNFT(address nftContract, uint256 tokenId) external payable;

    // Offer Functions
    function makeOffer(address nftContract, uint256 tokenId, uint256 durationSeconds) external payable returns (uint256);
    function cancelOffer(uint256 offerId) external;
    function acceptOffer(uint256 offerId) external;

    // Auction Functions
    function createAuction(address nftContract, uint256 tokenId, uint256 startingPrice, uint256 durationSeconds) external returns (uint256);
    function placeBid(uint256 auctionId) external payable;
    function endAuction(uint256 auctionId) external;
    function cancelAuction(uint256 auctionId) external;

    // View Functions
    function getListing(address nftContract, uint256 tokenId) external view returns (MarketplaceTypes.Listing memory);
    function getOffer(uint256 offerId) external view returns (MarketplaceTypes.Offer memory);
    function getAuction(uint256 auctionId) external view returns (MarketplaceTypes.Auction memory);
}
