import { createContext, useContext, useState,useEffect } from 'react';

const WalletContext = createContext();

export const useWallet = () => {
  return useContext(WalletContext);
};

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const storedAccount = localStorage.getItem('defaultAccount');
    if (storedAccount) {
      setAccount(storedAccount);
    }

    const storedBalance = localStorage.getItem('accountBalance');
    if (storedBalance) {
      setBalance(storedBalance);
    }
  }, []);

  const updateAccount = (newAccount) => {
    localStorage.setItem('defaultAccount', newAccount);
    setAccount(newAccount);
  };

  const updateBalance = (newBalance) => {
    localStorage.setItem('accountBalance', newBalance.toString());
    setBalance(newBalance.toString());
  };

  const value = {
    account,
    updateAccount,
    balance,
    updateBalance,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};
