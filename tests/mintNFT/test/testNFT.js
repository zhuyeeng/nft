const { expect } = require("chai");

describe("NFT Contract", function(){
    async function deployToken(){
        const [owner,Player1] = await ethers.getSigners();
        const uri = "https://ipfs.filebase.io/ipfs/QmR53eKpCo87CewvRkY6EwkssvMc7ppNZNVEJNnGe9CNbX"
        const MintNFT = await ethers.getContractFactory("TestNFT");
        const contract = await MintNFT.deploy();
        console.log("Master address:", await contract.address);
    
        await contract.deployed();

        return { contract, owner, Player1, uri };
    };

    it("Should deploy the contract and check inital state", async function(){
        const { contract, owner} = await deployToken();
        expect(await contract.name()).to.equal("TestNFT");
        expect(await contract.symbol()).to.equal("TN");
        
        expect(await contract.balanceOf(owner.address)).to.equal(0);
    });

    it("Should mint an NFT and verify ownership and URI", async function(){
        const { contract, owner, Player1, uri} = await deployToken();
        await contract.connect(owner).safeMint(Player1.address, uri);
        expect(await contract.ownerOf(0)).to.equal(Player1.address);
        expect(await contract.tokenURI(0)).to.equal(uri);
    });

    it("Should able to change the URI of the NFT", async function(){
        const { contract, owner, Player1, uri } = await deployToken();
        const sec_uri = "https://ipfs.filebase.io/ipfs/QmaoJF8d4XGtSQQyKJo46WTEzzCgQxPioma2EhgAqTdy1H";
        await contract.connect(owner).safeMint(Player1.address, uri);
        await contract.connect(owner).modifyTokenURI(0, sec_uri);
        expect(await contract.tokenURI(0)).to.equal(sec_uri);
    });

    it("Not the owner of the NFT unable to change the URI", async function () {
        const { contract, owner, Player1, uri } = await deployToken();
        const sec_uri = "https://ipfs.filebase.io/ipfs/QmaoJF8d4XGtSQQyKJo46WTEzzCgQxPioma2EhgAqTdy1H";
        await contract.connect(owner).safeMint(Player1.address, uri);
        await expect(contract.connect(Player1).modifyTokenURI(0, sec_uri)).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it("Should not mint more than the limit", async function () {
        const { contract, owner } = await deployToken();
        const max = await contract.MAX_SUPPLY();

        for (let i = 0; i < max; i++) {
            await contract.connect(owner).safeMint(owner.address, "");
        }

        await expect(contract.connect(owner).safeMint(owner.address, "")).to.be.revertedWith("Sorry, All NFT have been minted");

    });
});