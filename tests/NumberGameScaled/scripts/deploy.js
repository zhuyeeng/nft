const { ethers, upgrades } = require("hardhat");

async function main() {
  const NumberGame = await ethers.getContractFactory("NumberGame");
  const numberGame = await upgrades.deployProxy(NumberGame, [defaultMinBet], { initializer: 'initialize' });

  await numberGame.deployed();

  console.log("NumberGame deployed to:", numberGame.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
