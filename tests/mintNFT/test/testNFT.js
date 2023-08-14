const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers"); // use to redeploy the contract for faster testing to improve reliability.
const { expect } = require("chai");

        

describe("NumberGame Contract", function(){
    async function deployToken(){
        const [owner,Player1,Player2] = await ethers.getSigners();
        const uri = "https://ipfs.filebase.io/ipfs/QmR53eKpCo87CewvRkY6EwkssvMc7ppNZNVEJNnGe9CNbX"
        const defaultRoyaltyFees = ethers.utils.parseUnits('5');
        const MintNFT = await ethers.getContractFactory("NftMintContract");
        const SellNFT= await ethers.getContractFactory("SellNFTContract");
        const contract = await MintNFT.deploy();
        console.log("Master address:", await contract.address);
    
        const MasterAdd = await contract.address;
        const SellContract = await SellNFT.deploy(MasterAdd, defaultRoyaltyFees);

        await contract.deployed();
        await SellContract.deployed();


        return {contract,SellContract,owner,Player1,Player2,uri};
    };

    it("Reach max supply", async function(){
        const {contract,Player1,Player2,uri} = await loadFixture(deployToken);
        await expect(contract.connect(Player1).safeMint(Player2,uri)).to.be.revertedWith("Sorry, All NFT have been minted");
    });
});