import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { ethers } from "ethers";
import { useMetaMask } from "metamask-react";
import { walletModalShow } from "../../redux/counterSlice";

export default function WalletButtonLight() {
  const dispatch = useDispatch();
  const { status, connect } = useMetaMask();
  const [defaultAccount, setDefaultAccount] = useState(null);

  const connectWalletHandler = async () => {
    if (window.ethereum && !defaultAccount) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setDefaultAccount(accounts[0]);
        localStorage.setItem('defaultAccount', accounts[0]);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(accounts[0]);
        const balanceInEther = ethers.utils.formatEther(balance);
        const [integerPart, decimalPart] = balanceInEther.split('.');
        const formattedBalance = `${integerPart}.${decimalPart.substring(0, 6)}....`;
        localStorage.setItem('accountBalance', formattedBalance);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else if (!window.ethereum) {
        console.log('Need to install MetaMask');
    }
  };

  const renderButton = (onClickHandler, iconPath) => (
    <button
      onClick={onClickHandler}
      className="js-wallet border-jacarta-100 focus:bg-accent group hover:bg-accent flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent border-transparent bg-white/[.15]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={24}
        height={24}
        className="h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white fill-white"
      >
        {iconPath}
      </svg>
    </button>
  );

  const iconPath = (
    <>
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M22 6h-7a6 6 0 1 0 0 12h7v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2zm-7 2h8v8h-8a4 4 0 1 1 0-8zm0 3v2h3v-2h-3z" />
    </>
  );

  switch (status) {
    case "initializing":
      return <div>Ongoing...</div>;
    case "unavailable":
      return renderButton(() => dispatch(walletModalShow()), iconPath);
    case "notConnected":
      return renderButton(connectWalletHandler, iconPath);
    case "connecting":
      return <div>Connecting...</div>;
    default:
      return null;
  }
}
