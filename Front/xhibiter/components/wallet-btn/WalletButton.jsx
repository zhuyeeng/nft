import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { ethers } from "ethers";
import { useMetaMask } from "metamask-react";
import { walletModalShow } from "../../redux/counterSlice";

export default function WalletButton() {

  const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');
	const [provider, setProvider] = useState(null);
  const dispatch = useDispatch();
  const { status } = useMetaMask();

  const connectWalletHandler = () => {
    if (window.ethereum && !defaultAccount) {
      setProvider(new ethers.providers.Web3Provider(window.ethereum));
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(result => {
          setConnButtonText('Wallet Connected');
          setDefaultAccount(result[0]);
          localStorage.setItem('defaultAccount', result[0]);
          
          const localProvider = new ethers.providers.Web3Provider(window.ethereum);
          localProvider.getBalance(result[0]).then(balance => {
            let balanceInEther = ethers.utils.formatEther(balance);
            // Format balance as you want
            let [integerPart, decimalPart] = balanceInEther.split('.');
            balanceInEther = `${integerPart}.${decimalPart.substring(0, 6)}....`;
            localStorage.setItem('accountBalance', balanceInEther);
          });
        })
        .catch(error => {
          setErrorMessage(error.message);
        });

    } else if (!window.ethereum){
        console.log('Need to install MetaMask');
        setErrorMessage('Please install MetaMask browser extension to interact');
    }
}

  const walletHandler = () => {
    if (status === "unavailable") {
      dispatch(walletModalShow());
    }
  };

  // Render logic
  if (status === "initializing") return <div>Ongoing...</div>;

  const buttonClassNames = "js-wallet border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]";
  const svgClassNames = "h-4 w-4 fill-jacarta-700 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white";
  const svgPath = (
    <>
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M22 6h-7a6 6 0 1 0 0 12h7v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2zm-7 2h8v8h-8a4 4 0 1 1 0-8zm0 3v2h3v-2h-3z" />
    </>
  );
  const renderButton = (onClickHandler) => (
    <button
      onClick={onClickHandler}
      className={buttonClassNames}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={24}
        height={24}
        className={svgClassNames}
      >
        {svgPath}
      </svg>
    </button>
  );
  
  if (status === "unavailable") {
    return renderButton(walletHandler);
  }
  
  if (status === "notConnected") {
    return renderButton(connectWalletHandler);
  }

  if (status === "connecting") return <div>Connecting...</div>;

  return defaultAccount, userBalance;
}
