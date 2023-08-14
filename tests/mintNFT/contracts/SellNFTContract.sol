// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./NftMintContract.sol"; // Import the original NFT contract

contract NFTMarketplace {
    TestNFT private nftContract;
    address public owner;
    
    uint256 public royaltyPercentage; // Royalty fee percentage

    struct NftListing {
        address seller;
        uint256 tokenId;
        uint256 price;
    }

    NftListing[] public nftListings;

    mapping(uint256 => address) public approvedSellers;

    event NftListed(address indexed seller, uint256 indexed tokenId, uint256 price);
    event NftSold(address indexed seller, address indexed buyer, uint256 indexed tokenId, uint256 price);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor(address _nftContractAddress, uint256 _royaltyPercentage) payable {
        nftContract = TestNFT(_nftContractAddress);
        owner = msg.sender;
        royaltyPercentage = _royaltyPercentage;
    }

    function listNFT(uint256 _tokenId, uint256 _priceDecimal) external {
        require(nftContract.ownerOf(_tokenId) == msg.sender, "Only the owner can list this NFT");

        // Convert the decimal price to wei (assuming you want to multiply by 10^18 for Ether to wei conversion)
        uint256 priceInWei = _priceDecimal * 10**18;

        nftListings.push(NftListing({
            seller: msg.sender,
            tokenId: _tokenId,
            price: priceInWei
        }));
        emit NftListed(msg.sender, _tokenId, priceInWei);
    }

    function buyNFT(uint256 _listingIndex) external payable {
        NftListing memory listing = nftListings[_listingIndex];
        require(msg.value >= listing.price, "Insufficient funds sent");
        require(msg.sender != listing.seller, "You cannot buy your own NFT");

        // Transfer NFT ownership
        nftContract.safeTransferFrom(listing.seller, msg.sender, listing.tokenId);

        // Calculate and send royalty fee
        uint256 royaltyFee = (listing.price * royaltyPercentage) / 100;
        payable(listing.seller).transfer(listing.price - royaltyFee);

        // Emit event
        emit NftSold(listing.seller, msg.sender, listing.tokenId, listing.price);

        // Remove the listing
        delete nftListings[_listingIndex];
    }

    function setRoyaltyPercentage(uint256 _newRoyaltyPercentage) external onlyOwner {
        require(_newRoyaltyPercentage <= 100, "Royalty percentage must be <= 100");
        royaltyPercentage = _newRoyaltyPercentage;
    }

    function approveSeller(uint256 _tokenId, address _seller) external onlyOwner {
        approvedSellers[_tokenId] = _seller;
    }

    function removeSellerApproval(uint256 _tokenId) external onlyOwner {
        delete approvedSellers[_tokenId];
    }
}
