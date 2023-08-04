import { useDispatch, useSelector } from "react-redux";
import { walletModalShow, setDefaultAccount, setUserBalance } from "../../redux/counterSlice";
import { useMetaMask } from "metamask-react";
import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";

export default function WalletButton() {

  const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');
	const [provider, setProvider] = useState(null);
  const dispath = useDispatch();
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  const connectWalletHandler = () => {
		if (window.ethereum && defaultAccount == null) {
			// set ethers provider
			setProvider(new ethers.providers.Web3Provider(window.ethereum));

			// connect to metamask
			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				setConnButtonText('Wallet Connected');
				setDefaultAccount(result[0]);
			})
			.catch(error => {
				setErrorMessage(error.message);
			});

		} else if (!window.ethereum){
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

  useEffect(() => {
    if(defaultAccount){
    provider.getBalance(defaultAccount)
    .then(balanceResult => {
      const formattedBalance = ethers.utils.formatEther(balanceResult);
      setUserBalance(formattedBalance);
      dispath(setUserBalance(formattedBalance));
      // setUserBalance(ethers.utils.formatEther(balanceResult));
    })
    };
  }, [defaultAccount]);

  const walletHandler = () => {
    if (status === "unavailable") {
      dispath(walletModalShow());
    }
  };

  if (status === "initializing") return <div>Ongoing...</div>;

  if (status === "unavailable")
    return (
      <button
        onClick={walletHandler}
        className="js-wallet border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={24}
          height={24}
          className="h-4 w-4 fill-jacarta-700 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M22 6h-7a6 6 0 1 0 0 12h7v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2zm-7 2h8v8h-8a4 4 0 1 1 0-8zm0 3v2h3v-2h-3z" />
        </svg>
      </button>
    );

  if (status === "notConnected")
    return (
      <button
        onClick={connectWalletHandler}
        className="js-wallet border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={24}
          height={24}
          className="h-4 w-4 fill-jacarta-700 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M22 6h-7a6 6 0 1 0 0 12h7v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2zm-7 2h8v8h-8a4 4 0 1 1 0-8zm0 3v2h3v-2h-3z" />
        </svg>
      </button>
    );

  if (status === "connecting") return <div>Connecting...</div>;

  return defaultAccount, userBalance;
}
