// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

//INTERNAL IMPORT FOR NFT OPENZIPLINE

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.9.2/utils/Counters.sol";

contract NFTMarketPlace is ERC721URIStorage {
    using Counters for Counters.Counter;

 // State variables
    address payable public owner;
    uint256 public listingPrice = 0.0025 ether;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itmesSold;
    mapping(uint256 => uint8) private royalties;
    mapping(address => uint256) private pendingWithdrawals;
    mapping(uint256 => MarketItem) private idMarketItem;

    // Events
    event RoyaltySet(uint256 tokenId, uint8 percentage);
    event TokenURIUpdated(uint256 tokenId, string newTokenURI);
    event idMarketItemCtreated(uint256 _tokenId, address seller, address owner, uint256 price, bool sold);
    event Withdrawn(address indexed user, uint256 amount);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this operation.");
        _;
    }
        struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        address payable originalCreator;
        uint256 price;
        bool sold;
    }

    constructor() ERC721("NFT Test Token", "MYNFT") {
        owner == payable(msg.sender);
    }

    function setRoyalty(uint256 tokenId, uint8 percentage) external onlyOwner {
    require(percentage <= 100, "Percentage should be between 0 and 100");
    royalties[tokenId] = percentage;
    emit RoyaltySet(tokenId, percentage);
}

    function updateListingPrice(uint256 _listingPrice)
        public
        payable
        onlyOwner
    {
        listingPrice = _listingPrice;
    }

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    //Create NFT Token Function
    function createToken(string memory tokenURI, uint256 price)
        public
        payable
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        createMarketItem(newTokenId, price);

        return newTokenId;
    }

function updateTokenURI(uint256 tokenId, string memory newTokenURI) public onlyOwner {
    _setTokenURI(tokenId, newTokenURI);
    emit TokenURIUpdated(tokenId, newTokenURI);
}

    function updateTokenURIByOwner(uint256 tokenId, string memory newTokenURI)
        public
        onlyOwner
    {
        _setTokenURI(tokenId, newTokenURI);
    }

    
    function reSellToken(uint256 tokenId, uint256 price) public payable {
        require(
            idMarketItem[tokenId].owner == msg.sender,
            "Only item owner can perform opration or purchase."
        );

        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        idMarketItem[tokenId].sold = false;
        idMarketItem[tokenId].price = price;
        idMarketItem[tokenId].seller = payable(msg.sender);
        idMarketItem[tokenId].owner = payable(address(this));

        _itmesSold.decrement();

        _transfer(msg.sender, address(this), tokenId);
    }

       function createMarketSale(uint256 tokenId) public payable {
    uint256 price = idMarketItem[tokenId].price;
    require(msg.value == price, "Please submit the asking price in order to complete the purchase.");

    uint256 royaltyAmount = (price * royalties[tokenId]) / 100;
    uint256 sellerAmount = price - royaltyAmount - listingPrice;

    // Distributing royalties, listing price, and seller amount
    pendingWithdrawals[owner] += listingPrice;
    pendingWithdrawals[idMarketItem[tokenId].seller] += sellerAmount;
    
    // You may decide to send the royalties to the original creator or to another address.
    pendingWithdrawals[idMarketItem[tokenId].seller] += royaltyAmount;

    idMarketItem[tokenId].owner = payable(msg.sender);
    idMarketItem[tokenId].sold = true;
    idMarketItem[tokenId].owner = payable(address(0));

    _itmesSold.increment();
    _transfer(address(this), msg.sender, tokenId);
}
function fetchMarketItem() public view returns (MarketItem[] memory) {
    uint256 itemCount = _tokenIds.current();
    uint256 unSoldItemCount = _tokenIds.current() - _itmesSold.current();
    uint256 currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unSoldItemCount);
    for (uint256 i = 0; i < itemCount; i++) {
        if (idMarketItem[i + 1].owner == address(this)) {
            uint256 currentId = i + 1;
            MarketItem storage currentItem = idMarketItem[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }
    }
    return items; // Add this line to fix the warning
}


    
    function fetchMyNFT() public view returns (MarketItem[] memory) {
        uint256 totalCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalCount; i++) {
            if (idMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalCount; i++) {
            if (idMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

 
    //single user items
    function fetchItemsListed() public view returns (MarketItem[] memory) {
        uint256 totalCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalCount; i++) {
            if (idMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalCount; i++) {
            if (idMarketItem[i + 1].seller == msg.sender) {
                uint256 currentId = i + 1;

                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    function withdraw() external {
    uint256 amount = pendingWithdrawals[msg.sender];
    require(amount > 0, "No funds to withdraw");
    pendingWithdrawals[msg.sender] = 0;
    payable(msg.sender).transfer(amount);
    emit Withdrawn(msg.sender, amount);
}

function createMarketItem(uint256 tokenId, uint256 price) private {
    require(price > 0, "Price must be at least 1");
    require(msg.value == listingPrice, "Price must be equal to listing price");

    idMarketItem[tokenId] = MarketItem(
        tokenId,
        payable(msg.sender),
        payable(address(this)),
        payable(msg.sender),
        price,
        false
    );

    _transfer(msg.sender, address(this), tokenId);

    emit idMarketItemCtreated(tokenId, msg.sender, address(this), price, false);
}
}
