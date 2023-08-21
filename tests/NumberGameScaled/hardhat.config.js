require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require('dotenv').config();

const Infura_privatekey = process.env.INFURA_API_KEY;
const Georli_privatekey = process.env.GEORLI_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.0",
  paths:{
    artifacts: './artifacts'
  },
  networks: {
    georli: {
      url: `https://goerli.infura.io/v3/${Infura_privatekey}`,
      accounts: [Georli_privatekey]
    }
  }
};