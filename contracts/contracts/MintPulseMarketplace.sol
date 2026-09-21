// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "./libraries/MarketplaceTypes.sol";
import "./interfaces/IMintPulseMarketplace.sol";

contract MintPulseMarketplace is Ownable, ReentrancyGuard, Pausable, IMintPulseMarketplace {
    using MarketplaceTypes for MarketplaceTypes.Listing;
    using MarketplaceTypes for MarketplaceTypes.Offer;
    using MarketplaceTypes for MarketplaceTypes.Auction;

    // Errors
    error InvalidPrice();
    error InvalidAddress();
    error NotOwner();
    error AlreadyListed();
    error NotListed();
    error IncorrectPayment();
    error TransferFailed();
    error OfferExpired();
    error OfferNotActive();
    error AuctionNotActive();
    error AuctionNotEnded();
    error AuctionAlreadyEnded();
    error BidTooLow();

    // State Variables
    uint96 public platformFee = 250; // 2.5%
    address public feeReceiver;
    
    uint256 public nextListingId = 1;
    uint256 public nextOfferId = 1;
    uint256 public nextAuctionId = 1;
    
    uint256 public totalListings;
    uint256 public totalSales;
    uint256 public totalOffers;
    uint256 public totalAuctions;

    // Mappings
    // nftContract => tokenId => Listing
    mapping(address => mapping(uint256 => MarketplaceTypes.Listing)) private listings;
    
    // offerId => Offer
    mapping(uint256 => MarketplaceTypes.Offer) private offers;
    
    // auctionId => Auction
    mapping(uint256 => MarketplaceTypes.Auction) private auctions;

    constructor(address _feeReceiver) Ownable(msg.sender) {
        if (_feeReceiver == address(0)) revert InvalidAddress();
        feeReceiver = _feeReceiver;
    }

    // Admin Functions
    function setPlatformFee(uint96 newFee) external onlyOwner {
        require(newFee <= 1000, "Max fee 10%");
        platformFee = newFee;
    }

    function setFeeReceiver(address newReceiver) external onlyOwner {
        if (newReceiver == address(0)) revert InvalidAddress();
        feeReceiver = newReceiver;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // View Functions
    function getListing(address nftContract, uint256 tokenId) external view override returns (MarketplaceTypes.Listing memory) {
        return listings[nftContract][tokenId];
    }

    function isListed(address nftContract, uint256 tokenId) public view returns (bool) {
        return listings[nftContract][tokenId].status == MarketplaceTypes.ListingStatus.Active;
    }

    function getOffer(uint256 offerId) external view override returns (MarketplaceTypes.Offer memory) {
        return offers[offerId];
    }

    function getAuction(uint256 auctionId) external view override returns (MarketplaceTypes.Auction memory) {
        return auctions[auctionId];
    }

    // Payment Helper
    function _calculatePayment(address nftContract, uint256 tokenId, uint256 salePrice)
        internal
        view
        returns (MarketplaceTypes.PaymentDetails memory payment)
    {
        payment.totalAmount = salePrice;
        payment.platformFeeAmount = (salePrice * platformFee) / 10000;

        try IERC2981(nftContract).royaltyInfo(tokenId, salePrice) returns (address receiver, uint256 royalty) {
            payment.royaltyReceiver = receiver;
            payment.royaltyAmount = royalty;
        } catch {
            payment.royaltyReceiver = address(0);
            payment.royaltyAmount = 0;
        }

        payment.sellerPayout = salePrice - payment.platformFeeAmount - payment.royaltyAmount;
    }

    function _distributePayouts(address nftContract, uint256 tokenId, address seller, MarketplaceTypes.PaymentDetails memory payment) internal {
        if (payment.platformFeeAmount > 0 && feeReceiver != address(0)) {
            (bool feeSuccess, ) = payable(feeReceiver).call{value: payment.platformFeeAmount}("");
            if (!feeSuccess) revert TransferFailed();
        }

        if (payment.royaltyAmount > 0 && payment.royaltyReceiver != address(0)) {
            (bool royaltySuccess, ) = payable(payment.royaltyReceiver).call{value: payment.royaltyAmount}("");
            if (!royaltySuccess) revert TransferFailed();
        }

        (bool sellerSuccess, ) = payable(seller).call{value: payment.sellerPayout}("");
        if (!sellerSuccess) revert TransferFailed();
    }

    // Listing Logic
    function listNFT(address nftContract, uint256 tokenId, uint256 price) external override whenNotPaused nonReentrant {
        if (price == 0) revert InvalidPrice();
        if (nftContract == address(0)) revert InvalidAddress();

        IERC721 nft = IERC721(nftContract);
        if (nft.ownerOf(tokenId) != msg.sender) revert NotOwner();
        if (nft.getApproved(tokenId) != address(this) && !nft.isApprovedForAll(msg.sender, address(this))) {
            revert TransferFailed();
        }

        if (listings[nftContract][tokenId].status == MarketplaceTypes.ListingStatus.Active) revert AlreadyListed();

        uint256 listingId = nextListingId++;
        listings[nftContract][tokenId] = MarketplaceTypes.Listing({
            listingId: listingId,
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            price: price,
            status: MarketplaceTypes.ListingStatus.Active,
            createdAt: block.timestamp
        });

        totalListings++;
        emit NFTListed(tokenId, nftContract, msg.sender, price);
    }

    function cancelListing(address nftContract, uint256 tokenId) external override nonReentrant {
        MarketplaceTypes.Listing storage listing = listings[nftContract][tokenId];
        if (listing.status != MarketplaceTypes.ListingStatus.Active) revert NotListed();
        if (listing.seller != msg.sender) revert NotOwner();

        listing.status = MarketplaceTypes.ListingStatus.Cancelled;
        emit ListingCancelled(tokenId, msg.sender);
    }

    function updateListingPrice(address nftContract, uint256 tokenId, uint256 newPrice) external override nonReentrant {
        if (newPrice == 0) revert InvalidPrice();
        MarketplaceTypes.Listing storage listing = listings[nftContract][tokenId];
        if (listing.status != MarketplaceTypes.ListingStatus.Active) revert NotListed();
        if (listing.seller != msg.sender) revert NotOwner();

        listing.price = newPrice;
        emit ListingUpdated(tokenId, newPrice);
    }

    function buyNFT(address nftContract, uint256 tokenId) external payable override whenNotPaused nonReentrant {
        MarketplaceTypes.Listing storage listing = listings[nftContract][tokenId];
        if (listing.status != MarketplaceTypes.ListingStatus.Active) revert NotListed();
        if (msg.value != listing.price) revert IncorrectPayment();

        IERC721 nft = IERC721(nftContract);
        address seller = listing.seller;

        listing.status = MarketplaceTypes.ListingStatus.Sold;
        totalSales++;

        MarketplaceTypes.PaymentDetails memory payment = _calculatePayment(nftContract, tokenId, listing.price);
        
        nft.safeTransferFrom(seller, msg.sender, tokenId);
        _distributePayouts(nftContract, tokenId, seller, payment);

        emit NFTSold(tokenId, msg.sender, listing.price);
    }

    // Offers Logic
    function makeOffer(address nftContract, uint256 tokenId, uint256 durationSeconds)
        external
        payable
        override
        whenNotPaused
        nonReentrant
        returns (uint256)
    {
        if (msg.value == 0) revert InvalidPrice();
        if (nftContract == address(0)) revert InvalidAddress();

        uint256 offerId = nextOfferId++;
        uint256 expiresAt = block.timestamp + (durationSeconds > 0 ? durationSeconds : 7 days);

        offers[offerId] = MarketplaceTypes.Offer({
            offerId: offerId,
            offeror: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            offerPrice: msg.value,
            expiresAt: expiresAt,
            status: MarketplaceTypes.OfferStatus.Pending
        });

        totalOffers++;
        emit OfferCreated(offerId, nftContract, tokenId, msg.sender, msg.value, expiresAt);
        return offerId;
    }

    function cancelOffer(uint256 offerId) external override nonReentrant {
        MarketplaceTypes.Offer storage offer = offers[offerId];
        if (offer.offeror != msg.sender) revert NotOwner();
        if (offer.status != MarketplaceTypes.OfferStatus.Pending) revert OfferNotActive();

        offer.status = MarketplaceTypes.OfferStatus.Cancelled;

        (bool refundSuccess, ) = payable(msg.sender).call{value: offer.offerPrice}("");
        if (!refundSuccess) revert TransferFailed();

        emit OfferCancelled(offerId, msg.sender);
    }

    function acceptOffer(uint256 offerId) external override whenNotPaused nonReentrant {
        MarketplaceTypes.Offer storage offer = offers[offerId];
        if (offer.status != MarketplaceTypes.OfferStatus.Pending) revert OfferNotActive();
        if (block.timestamp > offer.expiresAt) revert OfferExpired();

        IERC721 nft = IERC721(offer.nftContract);
        if (nft.ownerOf(offer.tokenId) != msg.sender) revert NotOwner();

        offer.status = MarketplaceTypes.OfferStatus.Accepted;
        address buyer = offer.offeror;
        uint256 amount = offer.offerPrice;

        MarketplaceTypes.PaymentDetails memory payment = _calculatePayment(offer.nftContract, offer.tokenId, amount);

        nft.safeTransferFrom(msg.sender, buyer, offer.tokenId);
        _distributePayouts(offer.nftContract, offer.tokenId, msg.sender, payment);

        emit OfferAccepted(offerId, msg.sender, buyer, amount);
    }

    // Auctions Logic
    function createAuction(address nftContract, uint256 tokenId, uint256 startingPrice, uint256 durationSeconds)
        external
        override
        whenNotPaused
        nonReentrant
        returns (uint256)
    {
        if (startingPrice == 0) revert InvalidPrice();
        if (nftContract == address(0)) revert InvalidAddress();

        IERC721 nft = IERC721(nftContract);
        if (nft.ownerOf(tokenId) != msg.sender) revert NotOwner();
        if (nft.getApproved(tokenId) != address(this) && !nft.isApprovedForAll(msg.sender, address(this))) {
            revert TransferFailed();
        }

        uint256 auctionId = nextAuctionId++;
        uint256 duration = durationSeconds > 0 ? durationSeconds : 3 days;

        auctions[auctionId] = MarketplaceTypes.Auction({
            auctionId: auctionId,
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            startingPrice: startingPrice,
            highestBid: 0,
            highestBidder: address(0),
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            status: MarketplaceTypes.AuctionStatus.Active
        });

        totalAuctions++;
        emit AuctionCreated(auctionId, nftContract, tokenId, msg.sender, startingPrice, block.timestamp + duration);
        return auctionId;
    }

    function placeBid(uint256 auctionId) external payable override whenNotPaused nonReentrant {
        MarketplaceTypes.Auction storage auction = auctions[auctionId];
        if (auction.status != MarketplaceTypes.AuctionStatus.Active) revert AuctionNotActive();
        if (block.timestamp >= auction.endTime) revert AuctionAlreadyEnded();

        uint256 minBid = auction.highestBid > 0 ? auction.highestBid + (auction.highestBid * 5 / 100) : auction.startingPrice;
        if (msg.value < minBid) revert BidTooLow();

        address previousBidder = auction.highestBidder;
        uint256 previousBid = auction.highestBid;

        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;

        // Refund previous bidder
        if (previousBidder != address(0) && previousBid > 0) {
            (bool refundSuccess, ) = payable(previousBidder).call{value: previousBid}("");
            if (!refundSuccess) revert TransferFailed();
        }

        emit BidPlaced(auctionId, msg.sender, msg.value);
    }

    function endAuction(uint256 auctionId) external override nonReentrant {
        MarketplaceTypes.Auction storage auction = auctions[auctionId];
        if (auction.status != MarketplaceTypes.AuctionStatus.Active) revert AuctionNotActive();
        if (block.timestamp < auction.endTime) revert AuctionNotEnded();

        auction.status = MarketplaceTypes.AuctionStatus.Ended;

        if (auction.highestBidder != address(0)) {
            IERC721 nft = IERC721(auction.nftContract);
            MarketplaceTypes.PaymentDetails memory payment = _calculatePayment(auction.nftContract, auction.tokenId, auction.highestBid);

            nft.safeTransferFrom(auction.seller, auction.highestBidder, auction.tokenId);
            _distributePayouts(auction.nftContract, auction.tokenId, auction.seller, payment);

            emit AuctionEnded(auctionId, auction.highestBidder, auction.highestBid);
        } else {
            emit AuctionEnded(auctionId, address(0), 0);
        }
    }

    function cancelAuction(uint256 auctionId) external override nonReentrant {
        MarketplaceTypes.Auction storage auction = auctions[auctionId];
        if (auction.seller != msg.sender) revert NotOwner();
        if (auction.status != MarketplaceTypes.AuctionStatus.Active) revert AuctionNotActive();
        if (auction.highestBidder != address(0)) revert AuctionNotActive(); // Cannot cancel if bids placed

        auction.status = MarketplaceTypes.AuctionStatus.Cancelled;
        emit AuctionCancelled(auctionId, msg.sender);
    }

    receive() external payable {}
    fallback() external payable {}
}