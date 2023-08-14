async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const defaultRoyaltyFees = ethers.utils.parseUnits('5');
    // const defaultMinBet = defaultMinBetRaw.toNumber();
    const MintNFT = await ethers.getContractFactory("NftMintContract");
    const SellNFT= await ethers.getContractFactory("SellNFTContract");
    const contract = await MintNFT.deploy(defaultMinBet);
    console.log("Master address:", await contract.address);

    const MasterAdd = await contract.address;
    const SellContract = await SellNFT.deploy(MasterAdd, defaultRoyaltyFees);

    console.log("Sell address:", await SellContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});