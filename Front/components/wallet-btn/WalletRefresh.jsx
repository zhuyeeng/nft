import React, { useEffect } from 'react';
import { ethers } from "ethers";

function WalletRefresh() {
    useEffect(() => {
        if (window.ethereum) {
            // Check if any accounts are connected
            window.ethereum.request({ method: 'eth_accounts' })
            .then(accounts => {
                if (accounts.length > 0) {
                    const currentAddress = accounts[0];
                    localStorage.setItem('defaultAccount', currentAddress);
    
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    // Fetch the balance
                    provider.getBalance(currentAddress).then(balance => {
                        let balanceInEther = ethers.utils.formatEther(balance);
                        // Format balance as you want
                        let [integerPart, decimalPart] = balanceInEther.split('.');
                        balanceInEther = `${integerPart}.${decimalPart.substring(0, 6)}....`;
                        localStorage.setItem('accountBalance', balanceInEther);
                    });
                } else {
                    console.log('No accounts connected');
    
                    // If no accounts are connected, remove cached data
                    localStorage.removeItem('defaultAccount');
                    localStorage.removeItem('accountBalance');
                }
            })
            .catch(error => {
                console.error("Error fetching accounts: ", error);
            });
        } else {
            console.log('MetaMask is not available');
        }
    }, []);

    return null; // This component doesn't render anything
}

export default WalletRefresh;
