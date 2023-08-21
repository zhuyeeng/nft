const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("NftContract", function () {
    let NftContract, nftContract, owner, addr1, addr2, addrs;

    beforeEach(async () => {
        NftContract = await ethers.getContractFactory("NftContract");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        nftContract = await NftContract.deploy(10);  // Deploying with maxSupply of 10
        await nftContract.deployed();
    });

    // describe("Deployment", function () {
    //     it("Should set the right owner", async function () {
    //         expect(await nftContract.owner()).to.equal(owner.address);
    //     });

    //     it("Should have the correct MAX_SUPPLY", async function () {
    //         expect(await nftContract.MAX_SUPPLY()).to.equal(10);
    //     });
    // });

    // describe("Minting", function () {
    //     it("Should mint NFT to the right address", async function () {
    //         await nftContract.enablePublicMinting();
    //         await nftContract.connect(addr1).safeMint(addr1.address, "https://example.com/token1");
    //         expect(await nftContract.ownerOf(0)).to.equal(addr1.address);
    //     });

    //     it("Should fail if not authorized to mint", async function () {
    //         await expect(nftContract.connect(addr1).safeMint(addr1.address, "https://example.com/token1"))
    //             .to.be.revertedWith("Not authorized to mint");
    //     });

    //     it("Should set the right token URI after minting", async function () {
    //         await nftContract.enablePublicMinting();
    //         await nftContract.connect(addr1).safeMint(addr1.address, "https://example.com/token1");

    //         expect(await nftContract.tokenURI(0)).to.equal("https://example.com/token1");
    //     });

    //     it("Should not mint more than MAX_SUPPLY", async function () {
    //         await nftContract.enablePublicMinting();

    //         for (let i = 0; i < 10; i++) {
    //             await nftContract.connect(addr1).safeMint(addr1.address, `https://example.com/token${i}`);
    //         }
    //         await expect(
    //             nftContract.connect(addr1).safeMint(addr1.address, "https://example.com/token11")
    //         ).to.be.revertedWith("Sorry, All NFT have been minted");
    //     });
    // });
    // Test for withdrawBalance
    it("Should allow the owner to withdraw the contract's balance", async function () {
        // Sending some ether to the contract
        const amount = ethers.utils.parseEther("1");
        await owner.sendTransaction({ to: nftContract.address, value: amount });
        
        const initialBalance = await ethers.provider.getBalance(owner.address);
        const tx = await nftContract.withdrawBalance();
        const receipt = await tx.wait();
        const gasUsed = receipt.gasUsed;
        const gasPrice = tx.gasPrice;
        const totalGasCost = gasUsed.mul(gasPrice);
    
        const expectedBalance = initialBalance.add(amount).sub(totalGasCost);
    
        const actualBalance = await ethers.provider.getBalance(owner.address);
        expect(actualBalance).to.equal(expectedBalance);
        
    });

    // Test for enablePublicMinting and disablePublicMinting
    it("Should allow the owner to enable and disable public minting", async function () {
        await nftContract.enablePublicMinting();
        expect(await nftContract.isMintingPublic()).to.equal(true);

        await nftContract.disablePublicMinting();
        expect(await nftContract.isMintingPublic()).to.equal(false);
    });

    it("Should revert if a non-owner tries to change the minting state", async function () {
        await expect(nftContract.connect(addr1).enablePublicMinting()).to.be.revertedWith(
            "Ownable: caller is not the owner"
        );

        await expect(nftContract.connect(addr1).disablePublicMinting()).to.be.revertedWith(
            "Ownable: caller is not the owner"
        );
    });

    // Test for transferContractOwnership
    it("Should allow the owner to transfer the contract's ownership", async function () {
        await nftContract.transferContractOwnership(addr1.address);
        expect(await nftContract.owner()).to.equal(addr1.address);
    });

    it("Should revert if a non-owner tries to transfer the contract's ownership", async function () {
        await expect(nftContract.connect(addr1).transferContractOwnership(addr2.address)).to.be.revertedWith(
            "Ownable: caller is not the owner"
        );
    });

    it("Should revert if the provided new owner address is the zero address", async function () {
        await expect(nftContract.transferContractOwnership(ethers.constants.AddressZero)).to.be.revertedWith(
            "Invalid address"
        );
    });


    beforeEach(async () => {
        // Mint an NFT and list it for sale
        await nftContract.enablePublicMinting();
        await nftContract.connect(addr1).safeMint(addr1.address, "https://example.com/token0");
        await nftContract.connect(addr1).sellNFT(0, ethers.utils.parseEther("1")); // List for 1 ETH
        await nftContract.connect(owner).setRoyaltyPercentage(10); // 10% royalty

    });

    // it("Should verify tokenCreators mapping for tokenId 0", async function () {
    //     const creatorAddress = await nftContract.tokenCreators(0);
    //     expect(creatorAddress).to.equal(addr1.address);
    // });


    // it("Should allow a buyer to purchase an NFT and listing removed afterwards", async function () {
    //     const listingPrice = ethers.utils.parseEther("1");

    //     // Before purchase, check the listing status
    //     let listing = await nftContract.nftListings(0);
    //     console.log(listing.isForSale); // should be true
    //     const originalCreatorBalanceBefore = await ethers.provider.getBalance(addr1.address);

    //     // Buyer sends enough ETH to purchase
    //     await nftContract.connect(addr2).buyNFT(0, { value: listingPrice });

    //     // After purchase, check the listing status
    //     listing = await nftContract.nftListings(0);
    //     console.log(listing.isForSale); // should be false

    //     // Check ownership transfer
    //     expect(await nftContract.ownerOf(0)).to.equal(addr2.address);

    //     // Check royalty payment + sale price to the original creator
    //     const originalCreatorBalanceAfter = await ethers.provider.getBalance(addr1.address);

    //     expect(originalCreatorBalanceAfter.sub(originalCreatorBalanceBefore)).to.equal(listingPrice);
    //     const listingAfterDelete = await nftContract.nftListings(0);

    //     expect(listingAfterDelete[0]).to.equal(ethers.constants.AddressZero);
    //     expect(listingAfterDelete[1].toString()).to.equal('0');
    //     expect(listingAfterDelete[2]).to.equal(false);
    // });

    // it("Should ensure the original creator receives royalties on subsequent sales", async function () {
    //     const listingPrice = ethers.utils.parseEther("1");

    //     // 2. Purchase by addr2
    //     const addr1BalanceBeforeFirstPurchase = await ethers.provider.getBalance(addr1.address);
    //     await nftContract.connect(addr2).buyNFT(0, { value: listingPrice });
    //     const addr1BalanceAfterFirstPurchase = await ethers.provider.getBalance(addr1.address);
    //     expect(addr1BalanceAfterFirstPurchase.sub(addr1BalanceBeforeFirstPurchase)).to.equal(listingPrice);

    //     // 3. List again by addr2
    //     await nftContract.connect(addr2).sellNFT(0, listingPrice);

    //     // 4. Purchase by addr3
    //     const originalCreatorBalanceBefore = await ethers.provider.getBalance(addr1.address);
    //     await nftContract.connect(addrs[0]).buyNFT(0, { value: listingPrice });
    //     const originalCreatorBalanceAfter = await ethers.provider.getBalance(addr1.address);

    //     let royaltyAmount = listingPrice.mul(10).div(100); // Assuming 10% royalty

    //     // 5. Check royalty payment to original creator for the second sale
    //     expect(originalCreatorBalanceAfter.sub(originalCreatorBalanceBefore)).to.equal(royaltyAmount);

    //     // Additional assertions can be added to check the owner of the NFT, the listing status, etc.
    // });


    // it("Should revert if not enough ETH is sent", async function () {
    //     const listingPrice = ethers.utils.parseEther("1");
    //     const insufficientAmount = listingPrice.sub(1); // Send less than the listing price

    //     await expect(nftContract.connect(addr2).buyNFT(0, { value: insufficientAmount })).to.be.revertedWith(
    //         "Insufficient funds sent"
    //     );
    // });

    // it("Should revert if the NFT is not listed for sale", async function () {
    //     // Check the listing status after listing it
    //     let listing = await nftContract.nftListings(0);
    //     expect(listing.isForSale).to.equal(true);

    //     // Now, cancel the sale using addr1 who is assumed to be the seller
    //     await nftContract.connect(addr1).cancelSale(0);

    //     // Check the listing status after canceling it
    //     listing = await nftContract.nftListings(0);
    //     expect(listing.isForSale).to.equal(false);

    //     // Attempt to purchase the NFT that has been canceled
    //     await expect(nftContract.connect(addr2).buyNFT(0, { value: ethers.utils.parseEther("1") }))
    //         .to.be.revertedWith("NFT is not for sale");
    // });


    // it("Should allow the owner of the NFT or contract owner to modify the token URI", async function () {
    //     // Assumptions: NFT with tokenId 0 exists and is owned by addr1

    //     // Modify URI as the NFT owner
    //     await nftContract.connect(addr1).modifyTokenURI(0, "newURI");
    //     expect(await nftContract.tokenURI(0)).to.equal("newURI");

    //     // Modify URI as the contract owner
    //     await nftContract.modifyTokenURI(0, "anotherURI");
    //     expect(await nftContract.tokenURI(0)).to.equal("anotherURI");
    // });

    // it("Should revert if a non-owner tries to modify the token URI", async function () {
    //     await expect(nftContract.connect(addr2).modifyTokenURI(0, "invalidURI")).to.be.revertedWith(
    //         "Only the NFT owner or contract owner can modify the URI"
    //     );
    // });

    // // Test for setRoyaltyPercentage
    // it("Should allow the contract owner to set the royalty percentage", async function () {
    //     await nftContract.setRoyaltyPercentage(20);  // Setting it to 10%
    //     expect(await nftContract.royaltyPercentage()).to.equal(20);
    // });

    // it("Should revert if a non-owner tries to set the royalty percentage", async function () {
    //     await expect(nftContract.connect(addr1).setRoyaltyPercentage(10)).to.be.revertedWith(
    //         "Ownable: caller is not the owner"
    //     );
    // });

    // it("Should revert if the royalty percentage is set over 100", async function () {
    //     await expect(nftContract.setRoyaltyPercentage(101)).to.be.revertedWith(
    //         "Royalty percentage should be between 0 and 100"
    //     );
    // });
    // Add more test cases for edge cases and scenarios

    
});


