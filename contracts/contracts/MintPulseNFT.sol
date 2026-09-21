// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// ==========================================================
// MintPulse NFT Contract
// ERC721 + URI Storage + Burnable + Pausable + Royalties
// OpenZeppelin v5.6.1
// ==========================================================

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract MintPulseNFT is
    ERC721,
    ERC721URIStorage,
    ERC721Burnable,
    ERC2981,
    Ownable,
    Pausable
{
    // ==========================================================
    // Custom Errors
    // ==========================================================

    error EmptyTokenURI();
    error InvalidAddress();
    error InvalidRoyaltyFee();
    error TokenDoesNotExist();

    // ==========================================================
    // Events
    // ==========================================================

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed creator,
        address indexed owner,
        string tokenURI
    );

    event RoyaltyUpdated(
        address indexed receiver,
        uint96 feeNumerator
    );

    event BaseURIUpdated(
        string newBaseURI
    );

    // ==========================================================
    // State Variables
    // ==========================================================

    uint256 private _nextTokenId;

    uint256 public totalMinted;

    string private _baseTokenURI;

    mapping(uint256 => address) private _creators;

    // Marketplace contract address
    address public marketplace;

    // ==========================================================
    // Constructor
    // ==========================================================

    constructor(
        string memory name_,
        string memory symbol_,
        address royaltyReceiver,
        uint96 royaltyFee
    )
        ERC721(name_, symbol_)
        Ownable(msg.sender)
    {
        if (royaltyReceiver == address(0))
            revert InvalidAddress();

        if (royaltyFee > 1000)
            revert InvalidRoyaltyFee();

        _setDefaultRoyalty(
            royaltyReceiver,
            royaltyFee
        );
    }

    // ==========================================================
    // Modifiers
    // ==========================================================

    modifier onlyMarketplace() {
        require(
            msg.sender == marketplace,
            "Only marketplace"
        );
        _;
    }

    // ==========================================================
    // Admin Functions
    // ==========================================================

    function setMarketplace(
        address newmarketplace
    )
        external
        onlyOwner
    {
        if (
            newmarketplace == address(0)
        ) revert InvalidAddress();

        marketplace = newmarketplace;
    }

    function pause()
        external
        onlyOwner
    {
        _pause();
    }

    function unpause()
        external
        onlyOwner
    {
        _unpause();
    }

    function setDefaultRoyalty(
        address receiver,
        uint96 feeNumerator
    )
        external
        onlyOwner
    {
        if (receiver == address(0))
            revert InvalidAddress();

        if (feeNumerator > 1000)
            revert InvalidRoyaltyFee();

        _setDefaultRoyalty(
            receiver,
            feeNumerator
        );

        emit RoyaltyUpdated(
            receiver,
            feeNumerator
        );
    }

    function setBaseURI(
        string calldata newBaseURI
    )
        external
        onlyOwner
    {
        _baseTokenURI = newBaseURI;

        emit BaseURIUpdated(
            newBaseURI
        );
    }

    // ==========================================================
    // Mint Functions
    // ==========================================================

    function mintNFT(
        address to,
        string calldata metadataURI
    )
        external
        whenNotPaused
        returns (uint256)
    {
        if (to == address(0))
            revert InvalidAddress();

        if (bytes(metadataURI).length == 0)
            revert EmptyTokenURI();

        uint256 tokenId = ++_nextTokenId;

        _safeMint(to, tokenId);

        _setTokenURI(tokenId, metadataURI);

        _creators[tokenId] = msg.sender;

        totalMinted++;

        emit NFTMinted(
            tokenId,
            msg.sender,
            to,
            metadataURI
        );

        return tokenId;
    }

    function mintWithRoyalty(
        address to,
        string calldata metadataURI,
        address royaltyReceiver,
        uint96 royaltyFee
    )
        external
        whenNotPaused
        returns (uint256)
    {
        if (to == address(0) || royaltyReceiver == address(0))
            revert InvalidAddress();

        if (bytes(metadataURI).length == 0)
            revert EmptyTokenURI();

        if (royaltyFee > 1000)
            revert InvalidRoyaltyFee();

        uint256 tokenId = ++_nextTokenId;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
        _setTokenRoyalty(tokenId, royaltyReceiver, royaltyFee);

        _creators[tokenId] = msg.sender;
        totalMinted++;

        emit NFTMinted(tokenId, msg.sender, to, metadataURI);
        return tokenId;
    }

    function getTokenCreator(uint256 tokenId) external view returns (address) {
        return _creators[tokenId];
    }

    function setRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) external {
        require(msg.sender == owner() || msg.sender == _creators[tokenId], "Not authorized");
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    // ==========================================================
    // Batch Mint
    // ==========================================================

    function batchMint(
        address to,
        string[] calldata metadataURIs
    )
        external
        whenNotPaused
    {
        if (to == address(0))
            revert InvalidAddress();

        uint256 length = metadataURIs.length;

        require(length > 0, "Empty array");

        for (uint256 i = 0; i < length; ) {

            if (
                bytes(metadataURIs[i]).length == 0
            ) revert EmptyTokenURI();

            uint256 tokenId = ++_nextTokenId;

            _safeMint(to, tokenId);

            _setTokenURI(
                tokenId,
                metadataURIs[i]
            );

            _creators[tokenId] = msg.sender;

            totalMinted++;

            emit NFTMinted(
                tokenId,
                msg.sender,
                to,
                metadataURIs[i]
            );

            unchecked {
                ++i;
            }
        }
    }

    // ==========================================================
    // Burn NFT
    // ==========================================================

    function burnNFT(
        uint256 tokenId
    )
        external
    {
        if (_ownerOf(tokenId) == address(0))
            revert TokenDoesNotExist();

        require(
            ownerOf(tokenId) == msg.sender,
            "Not token owner"
        );

        burn(tokenId);
    }

    // ==========================================================
    // Creator Information
    // ==========================================================

    function creatorOf(
        uint256 tokenId
    )
        external
        view
        returns(address)
    {
        if (_ownerOf(tokenId) == address(0))
            revert TokenDoesNotExist();

        return _creators[tokenId];
    }

    // ==========================================================
    // View Functions
    // ==========================================================

    function currentTokenId()
        external
        view
        returns(uint256)
    {
        return _nextTokenId;
    }

    function totalSupply()
        external
        view
        returns(uint256)
    {
        return totalMinted;
    }

    function exists(
        uint256 tokenId
    )
        external
        view
        returns(bool)
    {
        return _ownerOf(tokenId) != address(0);
    }

    // ==========================================================
    // Internal Functions
    // ==========================================================

    function _baseURI()
        internal
        view
        override
        returns(string memory)
    {
        return _baseTokenURI;
    }

        // ==========================================================
    // Internal Transfer Hook
    // ==========================================================

    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        override
        whenNotPaused
        returns (address)
    {
        return super._update(
            to,
            tokenId,
            auth
        );
    }

    // ==========================================================
    // Metadata Overrides
    // ==========================================================

    function tokenURI(
        uint256 tokenId
    )
        public
        view
        override(
            ERC721,
            ERC721URIStorage
        )
        returns (string memory)
    {
        if (_ownerOf(tokenId) == address(0))
            revert TokenDoesNotExist();

        return super.tokenURI(tokenId);
    }

    // ==========================================================
    // Royalty Information
    // ==========================================================

    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    )
        public
        view
        override(ERC2981)
        returns (
            address receiver,
            uint256 royaltyAmount
        )
    {
        return super.royaltyInfo(
            tokenId,
            salePrice
        );
    }

    // ==========================================================
    // Interface Support
    // ==========================================================

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(
            ERC721,
            ERC721URIStorage,
            ERC2981
        )
        returns (bool)
    {
        return super.supportsInterface(
            interfaceId
        );
    }

    // ==========================================================
    // Contract Information
    // ==========================================================

    function contractVersion()
        external
        pure
        returns(string memory)
    {
        return "MintPulse NFT v1.0";
    }

    function marketplaceAddress()
        external
        view
        returns(address)
    {
        return marketplace;
    }

    function isPaused()
        external
        view
        returns(bool)
    {
        return paused();
    }

    // ==========================================================
    // Cleanup
    // ==========================================================

    function renounceOwnership()
        public
        view
        override
        onlyOwner
    {
        revert(
            "Ownership cannot be renounced"
        );
    }
}