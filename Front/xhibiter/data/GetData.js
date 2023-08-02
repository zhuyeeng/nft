const { Web3 } = require('web3');
const axios = require('axios');
require('dotenv').config();
// const fs = require('fs');

// Assuming you have an instance of ethers connected to your Ethereum network.
const web3 = new Web3('https://goerli.infura.io/v3/5af30ed60a8b4765a596afccb963efe4');

// Replace 'YourContractAbi' with your NFT contract's ABI (Application Binary Interface).
const contractAbi = require('./ABI.json');
const contractAddress = '0x3827C6a8abC59440AF9d6FD48FdE23B9A141D6c3';

// Replace 'YourAccountPrivateKey' with the private key of the account you are using to interact with the contract.
const accountPrivateKey = '1b577387be7aa559921c3beb92802b32f7831e436f85fda93ee7e6c2acb70c0e';
// console.log(accountPrivateKey);
// Create a signer with the account's private key.

// Create an instance of the contract using the contract ABI and contract address.


async function getAllNFTData() {
  const nftData = [];

  const nftContract = new web3.eth.Contract(contractAbi,contractAddress);
  const totalIndex = await nftContract.methods.totalSupply().call();

  // Create an array of promises to fetch tokenURI and tokenOwner for each token
  const promises = [];
  for (let index = 0; index < totalIndex; index++) {
    promises.push(getNFTData(nftContract, index));
  }

  // Wait for all promises to resolve using Promise.all
  const results = await Promise.all(promises);

  // Store the results in the nftData array
  results.forEach((result) => {
    nftData.push({ owner: result.tokenOwner, nftUri: result.tokenURI });
  });

  // console.log(nftData);
  return nftData;
}

async function getNFTData(nftContract, index) {
  const tokenURI = await nftContract.methods.tokenURI(index).call();
  const tokenOwner = await nftContract.methods.ownerOf(index).call();

  return { tokenOwner, tokenURI };
}

async function getNFTDataFromIPFS() {

  let nftDatas = await  getAllNFTData();

  for (const data of nftDatas){
    const uriData = data.nftUri.replace('ipfs://', 'https://ipfs.io/ipfs/');
    // console.log(data);
    // console.log(uriData);

    try {
      const response = await axios.get(uriData);
      data.uriData = response.data;
    } catch (error) {
      console.error(`Error fetching data for ${data.nftUri}:`, error.message);
      // You can handle errors here if necessary
    }
  }
  return nftDatas;
}

function renameAndAddProperties(nftDataArray) {
	return nftDataArray.map((item,index) => {
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
		console.log(modifiedNftDatas[0]);
		return modifiedNftDatas;
	} catch (error) {
		console.error('Error fetching NFT data:', error.message);
	}
}

// fetchAndProcessNFTData()
module.exports = {fetchAndProcessNFTData};