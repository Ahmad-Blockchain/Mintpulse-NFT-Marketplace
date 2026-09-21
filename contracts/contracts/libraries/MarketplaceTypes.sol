// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

library MarketplaceTypes {
    enum ListingStatus { None, Active, Sold, Cancelled }
    enum OfferStatus { Pending, Accepted, Rejected, Cancelled, Expired }
    enum AuctionStatus { Active, Ended, Cancelled }

    struct Listing {
        uint256 listingId;
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        ListingStatus status;
        uint256 createdAt;
    }

    struct Offer {
        uint256 offerId;
        address offeror;
        address nftContract;
        uint256 tokenId;
        uint256 offerPrice;
        uint256 expiresAt;
        OfferStatus status;
    }

    struct Auction {
        uint256 auctionId;
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 startingPrice;
        uint256 highestBid;
        address highestBidder;
        uint256 startTime;
        uint256 endTime;
        AuctionStatus status;
    }

    struct Bid {
        uint256 auctionId;
        address bidder;
        uint256 amount;
        uint256 timestamp;
    }

    struct PaymentDetails {
        uint256 totalAmount;
        uint256 platformFeeAmount;
        uint256 royaltyAmount;
        uint256 sellerPayout;
        address royaltyReceiver;
    }
}
