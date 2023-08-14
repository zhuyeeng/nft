const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers"); // use to redeploy the contract for faster testing to improve reliability.
const { expect } = require("chai");

        

describe("NFT Contract", function(){
    async function deployToken(){
        const [owner,Player1,Player2] = await ethers.getSigners();
        const uri = "https://ipfs.filebase.io/ipfs/QmR53eKpCo87CewvRkY6EwkssvMc7ppNZNVEJNnGe9CNbX"
        const defaultRoyaltyFees = ethers.utils.parseUnits('5');
        const MintNFT = await ethers.getContractFactory("TestNFT");
        const SellNFT= await ethers.getContractFactory("NFTMarketplace");
        const contract = await MintNFT.deploy();
        console.log("Master address:", await contract.address);
    
        const MasterAdd = await contract.address;
        const SellContract = await SellNFT.deploy(MasterAdd, defaultRoyaltyFees);

        await contract.deployed();
        await SellContract.deployed();


        return {contract,SellContract,owner,Player1,Player2,uri};
    };

    it("Reach max supply", async function(){
        const {contract,Player1,owner,Player2,uri} = await loadFixture(deployToken);
        console.log(Player2);
        console.log(uri);
        await expect(contract.connect(owner).safeMint(owner,uri)).to.be.revertedWith("Sorry, All NFT have been minted");
    });
});