import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "tippy.js/dist/tippy.css";
import Meta from "../../components/Meta";
import Image from "next/image";
import { useWallet } from '../../context/walletContext';
import useNumberGame from '../../components/numbergame/numberGame';


const NumberGame = () => {
  const { account, balance } = useWallet();

  const [isWalletInitialized, setIsWalletInitialized] = useState(false);
  const [entryBet, setEntryBet] = useState("");
  const [guessBet, setGuessBet] = useState("");
  const [playerGuess, setPlayerGuess] = useState("");
  const [imageModal, setImageModal] = useState(false);

  // Only invoke useNumberGame once the wallet is initialized.
  const numberGameHooks = useNumberGame();
  const { joinGame, guess, withdraw } = isWalletInitialized ? numberGameHooks : {};

  useEffect(() => {
    if (account && balance) {
      setIsWalletInitialized(true);
      console.log("Wallet Initialized");
    }
  }, [account, balance]);

  const handleJoinGame = async () => {

    if (!joinGame) {
      console.error("joinGame function is not initialized yet.");
      return;
    }
    try {
      await joinGame(entryBet);
      // Maybe provide some success feedback here
    } catch (error) {
      console.error(error);
      // Display this error to the user
    }
  };


  const handleGuess = async () => {
    try {
      await guess(guessBet, playerGuess);
      // Maybe provide some success feedback here
    } catch (error) {
      console.error(error);
      // Display this error to the user
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdraw();
      // Maybe provide some success feedback here
    } catch (error) {
      console.error(error);
      // Display this error to the user
    }
  };



  return (
    <>
      <Meta title={`Number Game || DEMO`} />
      <section className="relative lg:mt-24 lg:pb-24 mt-24 pt-10 pb-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <Image
            width={1518}
            height={773}
            priority
            src="/images/gradient_light.jpg"
            alt="gradient"
            className="h-full w-full object-cover"
          />
        </picture>
        <div className="container">
          <div className="text-center mt-6">
            <h1 className="text-3xl font-semibold mb-5">Welcome to the Number Game</h1>
          </div>
          <div className="grid grid-cols-2 gap-4 items-center">
            <button
              className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block rounded-full py-2 px-4 w-1/2 ml-auto text-center font-semibold text-white transition-all m-2"
              disabled={!isWalletInitialized}
              onClick={handleJoinGame}
            >Join Game
            </button>
            <div style={{ width: '50%' }}>
              <input
                value={entryBet}
                onChange={(e) => setEntryBet(e.target.value)}
                className="border border-solid dark:border-jacarta-600 border-gray-300 mb-2 rounded-full py-2 px-4 w-full m-2"
                placeholder="Enter your Entry Bet here"
              />
            </div>
          </div>
          <div className="md:flex md:flex-wrap">
            <figure className="mb-8 md:w-2/5 md:flex-shrink-0 md:flex-grow-0 md:basis-auto lg:w-1/2 w-full">
              <button className="w-full" onClick={() => setImageModal(true)}>
                <Image width={585} height={726} src="/images/custom/numberGame.png" alt="Your Image Description" className="rounded-2xl cursor-pointer h-full object-cover w-full" />
              </button>
            </figure>
            <div className="md:w-3/5 md:basis-auto lg:w-1/5">
              <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white p-12">
                <p className="mb-3 font-semibold">Display Guessed number</p>
                <p className="mb-3 font-semibold">Display number of bets</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-between">
            <div className="flex justify-between w-full">
              <input
                value={guessBet}
                onChange={(e) => setGuessBet(e.target.value)}
                className="w-1/4 border border-solid dark:border-jacarta-600 border-gray-300 mb-3 rounded-full py-3 px-8 w-full m-3"
                placeholder="Enter your Bet here"
              />
              <input
                value={playerGuess}
                onChange={(e) => setPlayerGuess(e.target.value)}
                className="border border-solid dark:border-jacarta-600 border-gray-300 mb-3 rounded-full py-3 px-8 w-full m-3"
                placeholder="Enter your Guess here"
              />
            </div>
            <button
              className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block rounded-full py-3 px-8 text-center font-semibold text-white transition-all m-3"
              onClick={handleGuess}
            >Guess</button>
            <button
              className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block rounded-full py-3 px-8 text-center font-semibold text-white transition-all m-3"
              onClick={handleWithdraw}
            >Withdraw</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default NumberGame;