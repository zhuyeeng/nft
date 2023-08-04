const ethers = require('ethers');
const axios = require('axios');
require('dotenv').config();

// const infuraApiKey = 'YOUR_INFURA_API_KEY';
const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/5af30ed60a8b4765a596afccb963efe4`);

const contractAbi = require('./ABI.json');
const contractAddress = '0x3827C6a8abC59440AF9d6FD48FdE23B9A141D6c3';

// const wallet = new ethers.Wallet('0x' + 'YOUR_PRIVATE_KEY', provider);

async function getAllNFTData() {
  const nftData = [];

  const nftContract = new ethers.Contract(contractAddress, contractAbi, provider);
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
    // console.log(modifiedNftDatas);
  } catch (error) {
    console.error('Error fetching NFT data:', error.message);
  }
}
// fetchAndProcessNFTData();
module.exports = { fetchAndProcessNFTData };
