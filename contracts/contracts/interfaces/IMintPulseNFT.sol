// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

interface IMintPulseNFT is IERC721, IERC2981 {
    event NFTMinted(
        uint256 indexed tokenId,
        address indexed creator,
        address indexed owner,
        string tokenURI
    );

    function mintNFT(address recipient, string memory tokenURI) external returns (uint256);
    function mintWithRoyalty(
        address recipient,
        string memory tokenURI,
        address royaltyReceiver,
        uint96 royaltyFeeNumerator
    ) external returns (uint256);
    function getTokenCreator(uint256 tokenId) external view returns (address);
    function setRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) external;
    function pause() external;
    function unpause() external;
}
