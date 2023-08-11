const ethers = require('ethers');
const axios = require('axios');
require('dotenv').config();

const { nftContractAddress, providerURL } = require('../config/setting');
const contractAbi = require('./abi/nftMintAbi.json');
const provider = new ethers.providers.JsonRpcProvider(providerURL);


async function getAllNFTData() {
  const nftData = [];
  const nftContract = new ethers.Contract(nftContractAddress, contractAbi, provider);
  const totalIndex = await nftContract.totalSupply();
  const promises = [];
  for (let index = 0; index < totalIndex; index++) {
    promises.push(getNFTData(nftContract, index));
  }

  const results = await Promise.all(promises);

  results.forEach((result) => {
    nftData.push({ owner: result.tokenOwner, nftUri: result.tokenURI });
  });

  return nftData;
}

async function getNFTData(nftContract, index) {
  const tokenURI = await nftContract.tokenURI(index);
  const tokenOwner = await nftContract.ownerOf(index);

  return { tokenOwner, tokenURI };
}

async function getNFTDataFromIPFS() {
  let nftDatas = await getAllNFTData();

  for (const data of nftDatas) {
    const uriData = data.nftUri.replace('ipfs://', 'https://ipfs.io/ipfs/');

    try {
      const response = await axios.get(uriData);
      data.uriData = response.data;
    } catch (error) {
      console.error(`Error fetching data for ${data.nftUri}:`, error.message);
    }
  }

  return nftDatas;
}

function renameAndAddProperties(nftDataArray) {
  return nftDataArray.map((item, index) => {
    return {
      id: index,
      description: item.uriData.description,
      image: item.uriData.image,
      name: item.uriData.name,
      ownerName: item.uriData.ownerAddress,
      title: 'something',
      price: 1.55,
      like: 160,
      creatorImage: item.uriData.image,
      ownerImage: item.uriData.image,
      creatorName: 'hello',
      auction_timer: '636234213',
      text: 'Lorum',
      // Add any other properties you need
    };
  });
}

async function fetchAndProcessNFTData() {
  try {
    const nftDataWithUriData = await getNFTDataFromIPFS();
    const modifiedNftDatas = renameAndAddProperties(nftDataWithUriData);
    return modifiedNftDatas;
  } catch (error) {
    console.error('Error fetching NFT data:', error.message);
  }
}
// fetchAndProcessNFTData();
module.exports = { fetchAndProcessNFTData };