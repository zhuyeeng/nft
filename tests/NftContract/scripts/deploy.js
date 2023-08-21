const { ethers } = require("hardhat");

async function main() {
  const NftContract = await ethers.getContractFactory("NftContract");
  
  const maxSupply = 10;  // Define the value for maxSupply
  
  const nftContract = await NftContract.deploy(maxSupply);
  await nftContract.deployed();

  console.log("NftContract deployed to:", nftContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
