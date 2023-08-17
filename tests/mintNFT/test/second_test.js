const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers"); // use to redeploy the contract for faster testing to improve reliability.
const { expect } = require("chai");
const { ethers, deployments, getNamedAccounts } = require("hardhat");

describe("Buy Sell NFT Contract", function(){
    async function deployToken(){
        const [owner, seller, buyer] = await ethers.getSigners();
        const uri = "https://ipfs.filebase.io/ipfs/QmR53eKpCo87CewvRkY6EwkssvMc7ppNZNVEJNnGe9CNbX"
        const defaultRoyaltyFees = 5;
        const MintNFT = await ethers.getContractFactory("TestNFT");
        const SellNFT= await ethers.getContractFactory("NFTMarketplace");
        const contract = await MintNFT.deploy();
        const MasterAdd = await contract.address;
        await contract.connect(owner).safeMint(seller.address, uri);
        const SellContract = await SellNFT.deploy(MasterAdd, defaultRoyaltyFees);
        const secondContractAdd = await SellContract.address;

        return {secondContractAdd, SellContract, owner, seller, buyer, contract, uri};
    };

    it("Approve the NFT to the second contract to sell", async function(){
        const { seller, contract, secondContractAdd } = await deployToken();
        await contract.connect(seller).approve(secondContractAdd, 0);
    });

    it("Should allow a buyer to purchase an NFT", async function () {
        const { secondContractAdd , seller, buyer, contract, SellContract } = await loadFixture(deployToken);
        // const royaltyFee = await SellContract.royaltyFee();
        const royaltyPercentage =  await SellContract.royaltyPercentage();

        //Set the price of the NFT
        const NFTprice = ethers.utils.parseEther("0.0001");
        const NFTprice2 = ethers.utils.parseEther("0.01");

        //Approve the NFT to the buy sell contract
        await contract.connect(seller).approve(secondContractAdd, 0);
        const total = await contract.totalSupply();

        //Approve the seller to sell NFT
        const approveSeller = await SellContract.approveSeller(0,seller.address);

        //List the NFT for sale
        await SellContract.connect(seller).listNFT(0, NFTprice);
        
        // Check NFT Details
        // const NFTDetails = await SellContract.nftListings(0);
        // console.log("Check The NFT Details: ", NFTDetails);

        //Checking the percentage and also check the buyer balance
        // const percentages = await SellContract.royaltyPercentage();
        // const buyerBalanceBefore = await buyer.getBalance();
        // const sellerBalanceBefore = await seller.getBalance();
        // console.log(percentages)
        // const availableBalance = ethers.utils.formatEther(buyerBalanceBefore);
        // const sellerBalanceBeforeBuy = ethers.utils.formatEther(sellerBalanceBefore);
        // console.log("Seller balance: ", sellerBalanceBeforeBuy);
        // console.log("Buyer's Available Balance:", availableBalance);

        await SellContract.connect(buyer).buyNFT(0, { value: NFTprice2 });
        // const NFTDetailsAfter = await SellContract.nftListings(0);
        // const buyerBalance = await buyer.getBalance();
        // const sellerBalanceAfter = await seller.getBalance();
        // const availableBalanceAfter = ethers.utils.formatEther(buyerBalance);
        // const sellerBalanceAfterBuy = ethers.utils.formatEther(sellerBalanceAfter);
        // console.log("Seller Balance After: ", sellerBalanceAfterBuy);
        // console.log("Buyer current balance: ", availableBalanceAfter);
        // console.log("NFT Details after sold: ", NFTDetailsAfter);
    });
});