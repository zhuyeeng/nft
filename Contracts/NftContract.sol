// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";




contract NftContract is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    uint256 public MAX_SUPPLY;
    uint256 public royaltyPercentage;
    bool public isMintingPublic = false;

    mapping(uint256 => Listing) public nftListings;
    mapping(uint256 => address) public tokenCreators;

    event NFTListedForSale(address indexed seller, uint256 tokenId, uint256 price);
    event NFTPurchased(address buyer, uint256 tokenId, uint256 price);
    event SaleCanceled(address indexed seller, uint256 tokenId);

    receive() external payable {}

    struct Listing {
        address seller;
        uint256 price;
        bool isForSale;
    }

    constructor(uint256 maxSupply) ERC721("NftContract", "NFTC") {
        MAX_SUPPLY = maxSupply;
    }

    //Internal Function
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function safeMint(address to, string memory uri) public {
        require(isMintingPublic || msg.sender == owner(), "Not authorized to mint");

        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId < MAX_SUPPLY, "Sorry, All NFT have been minted");
        
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        tokenCreators[tokenId] = to; // Set the creator for the NFT
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    // The following functions are overrides required by Solidity.
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    //external function
    //The original owner of the NFT unable to get and need to store the orignal owner address, so that the royalty fee can transfer to the person.
    function buyNFT(uint256 tokenId) external payable nonReentrant{
        Listing memory listing = nftListings[tokenId];

        require(listing.isForSale, "NFT is not for sale");
        address payable sellerAddress = payable(listing.seller);
        address payable originalCreator = payable(tokenCreators[tokenId]);

        uint256 price = listing.price;
        require(msg.value >= price, "Insufficient funds sent");

        uint256 royaltyAmount = (price * royaltyPercentage) / 100;
        uint256 remainingAmount = price - royaltyAmount;
        _transfer(sellerAddress, msg.sender, tokenId);

        // Transfer royalty fee to the original owner
        originalCreator.transfer(royaltyAmount);

        // Transfer remaining amount to the seller
        (bool success, ) = sellerAddress.call{value: remainingAmount}("");
        require(success, "Transfer failed");
        emit NFTPurchased(msg.sender, tokenId, listing.price);

        // Remove the NFT listing
        delete nftListings[tokenId];

    }

    function sellNFT(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        nftListings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            isForSale: true
        });

        // Emit event for listing the NFT for sale
        emit NFTListedForSale(msg.sender, tokenId, price);
    }

    function cancelSale(uint256 tokenId) external {
        require(nftListings[tokenId].seller == msg.sender, "Not the seller");
        require(nftListings[tokenId].isForSale, "NFT is not listed for sale");

        emit SaleCanceled(msg.sender,tokenId);
        // Remove the NFT listing
        delete nftListings[tokenId];
    }



    //The function that only owner can use
    function modifyTokenURI(uint256 tokenId, string calldata newURI) external {
        require(ownerOf(tokenId) == msg.sender || msg.sender == owner(), "Only the NFT owner or contract owner can modify the URI");
        _setTokenURI(tokenId, newURI);
    }


    function setRoyaltyPercentage(uint256 _royaltyPercentage) external onlyOwner {
        require(_royaltyPercentage <= 100, "Royalty percentage should be between 0 and 100");
        royaltyPercentage = _royaltyPercentage;
    }

    function withdrawBalance() external onlyOwner {
        address payable ownerAddress = payable(owner());
        ownerAddress.transfer(address(this).balance);
    }

    function enablePublicMinting() external onlyOwner {
        isMintingPublic = true;
    }

    function disablePublicMinting() external onlyOwner {
        isMintingPublic = false;
    }

    // Function to transfer ownership to a new address
    function transferContractOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        transferOwnership(newOwner);
    }

}