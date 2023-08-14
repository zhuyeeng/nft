require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");

const { alchemyApiKey, mnemonic } = require('./secrets.json'); // Import your Alchemy API key and mnemonic

module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${alchemyApiKey}`,
      accounts: { mnemonic: mnemonic },
    },
  },
};
