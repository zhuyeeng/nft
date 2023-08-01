const { ethers } = require('ethers');
const axios = require('axios');
require('dotenv').config();
// const fs = require('fs');

// Assuming you have an instance of ethers connected to your Ethereum network.
const provider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/5af30ed60a8b4765a596afccb963efe4');

// Replace 'YourContractAbi' with your NFT contract's ABI (Application Binary Interface).
const contractAbi = require('./ABI.json');
const contractAddress = process.env.CONTRACT_ADDRESS;

// Replace 'YourAccountPrivateKey' with the private key of the account you are using to interact with the contract.
const accountPrivateKey = process.env.PRIVATE_KEY;
// console.log(accountPrivateKey);
// Create a signer with the account's private key.
const signer = new ethers.Wallet(accountPrivateKey, provider);

// Create an instance of the contract using the contract ABI and contract address.
const nftContract = new ethers.Contract(contractAddress, contractAbi, signer);

const items_data = [];

// Call the 'uri' public variable using the 'uri' method.
async function getNFT() {

  let i = 0;
  const nftUri = [];

  while (true) {
    try {
      const x = await nftContract.tokenURI(i);
      nftUri.push(x);
      i++;
    } catch (error) {
      // Break the loop when there are no more valid token IDs
      break;
    }
  }
  return nftUri;
}

async function getOwner() {

  let i = 0;
  const nftOwner = [];

  while (true) {
    try {
      const owner = await nftContract.ownerOf(i);
      nftOwner.push(owner);
      i++;
    } catch (error) {
      // Break the loop when there are no more valid token IDs
      console.log(error.message);
      // break;
    }
  }
  return nftOwner;
}

async function getNFTDataFromIPFS() {

  const arrayData = [];

  try {
    const nftUris = await getNFT(); // Array of URIs returned by getNFT()
    const nftOwnerAddress = await getOwner();
    let nftId = 1;

    for (const uri of nftUris) {
      const nftDataUrl = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
      
      // Fetch data from the IPFS URL
      const response = await axios.get(nftDataUrl);

      // Parse the response data as JSON
      const nftData = response.data;

      const ownerAddress = nftOwnerAddress[nftId - 1];

      const formattedData = {
        nftId: nftId,
        description: nftData.description,
        image: nftData.image,
        name: nftData.name,
        ownerAddress: ownerAddress,
      }

      arrayData.push(formattedData);
      nftId++;
    }

  } catch (error) {
    console.error('Error fetching NFT data:', error.message);
  }
  return arrayData;
}

async function pushData(){

  try{
    const Data = await getNFTDataFromIPFS();
    
    for (const nftData of Data) {
      const getData = [{
        // id: nftData.nftId,
        // description: nftData.description,
        // image: nftData.image,
        // name: nftData.name,
        // ownerAddress: nftData.ownerAddress,
          id: nftData.nftId,
          description: nftData.description,
          image: nftData.image,
          name: nftData.name,
          ownerName: nftData.ownerAddress,
          title: 'something',
          price: 1.55,
          like: 160,
          creatorImage: nftData.image,
          ownerImage: nftData.image,
          creatorName: 'hello',
          auction_timer: '636234213',
          text: 'Lorum',
      }];
      items_data.push(getData);
    }
    return;
  }catch(error){
    console.log("Error Message: ",error.message);
    throw new Error;
  }
}

async function main(){
  try{
    await pushData();
    // console.log(items_data);
    return items_data;
  }catch(error){
    console.log('Error Message: ', error.message);
  }
}

module.exports = main;