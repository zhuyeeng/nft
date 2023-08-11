import {ethers,providers} from 'ethers';
import axios from 'axios';
import { nftContractAddress, providerURL } from '../config/setting';
import contractAbi from './abi/nftMintAbi.json';
require('dotenv').config();

const provider = new providers.JsonRpcProvider(providerURL);


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

function mapDataToCarouselFormat(nftDataArray) {
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

function mapDataToCollectionFormat(nftDataArray) {
  return nftDataArray.map((item, index) => {
    return {
      image: item.uriData.image, // adjust as needed
      id: index, // adjust as needed
      category: "Collectibles", // you may need to adjust or derive this
      title: item.uriData.name,
      nfsw: false, // you may need to adjust or derive this
      lazyMinted: true, // you may need to adjust or derive this
      verified: true, // you may need to adjust or derive this
      addDate: `date #${index}`, // you may need to adjust or derive this
      sortPrice: 5.9, // you may need to adjust or derive this
      price: `From ${5.9} ETH`, // adjust as needed
      bidLimit: 7, // you may need to adjust or derive this
      bidCount: 1, // you may need to adjust or derive this
      likes: 188, // you may need to adjust or derive this
      creator: {
        name: `demo #${index}`, // you may need to adjust or derive this
        image: item.uriData.image, // adjust as needed
      },
      owner: {
        name: `owner #${index}`, // you may need to adjust or derive this
        image: item.uriData.image, // adjust as needed
      },
    };
  });
}

async function fetchCarouselNFTData() {
  try {
    const nftDataWithUriData = await getNFTDataFromIPFS();
    const modifiedNftDatas = mapDataToCarouselFormat(nftDataWithUriData);
    return modifiedNftDatas;
  } catch (error) {
    console.error('Error fetching NFT data:', error.message);
  }
}

async function fetchCollectionNFTData () {
  try {
    const nftDataWithUriData = await getNFTDataFromIPFS();
    const modifiedNftDatas = mapDataToCollectionFormat(nftDataWithUriData);
    return modifiedNftDatas;
  } catch (error) {
    console.error('Error fetching NFT data:', error.message);
  }
}
// fetchAndProcessNFTData();
export { fetchCarouselNFTData, fetchCollectionNFTData };