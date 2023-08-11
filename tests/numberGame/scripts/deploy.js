async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const defaultMinBetRaw = ethers.utils.parseUnits('0.00005', 'ether');
    const defaultMinBet = defaultMinBetRaw.toNumber();
    const NumberGame = await ethers.getContractFactory("NumberGame");
    const contract = await NumberGame.deploy(defaultMinBet);

    console.log("NumberGame address:", await contract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});