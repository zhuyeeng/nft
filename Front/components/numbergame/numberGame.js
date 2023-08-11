import { ethers } from 'ethers';
import { useEffect,useState } from 'react'; 
import numberGameAbi from '../../data/abi/numberGameAbi.json';
import { numberGameAddress } from '../../config/setting';
import { useWallet } from '../../context/walletContext';

export default function useNumberGame() {
    const { account ,balance} = useWallet();
    const [contract, setContract] = useState(null);
    useEffect(() => {
        if (window.ethereum && account) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const createdContract = new ethers.Contract(numberGameAddress, numberGameAbi, signer);
<<<<<<< HEAD
            console.log(createdContract);
=======
>>>>>>> source/main
            setContract(createdContract);
        } else {
            console.error('MetaMask extension not found or account not connected.');
        }
    }, [account]);

    const joinGame = async (entryBet) => {
        if (!contract) {
            console.error("Contract is not initialized");
            return;
        }
        try {
            const valueToSend = ethers.utils.parseEther(entryBet); 
            const tx = await contract.joinGame({ value: valueToSend, gasLimit: 100000 });
            await tx.wait();
        } catch(error) {
            alert(error);
        }
    };

    async function guess(betValue, playerGuess){
        try{
            const valueToSend = ethers.utils.parseEther(betValue); 
            const guessing = await contract
<<<<<<< HEAD
            .makeGuess(playerGuess, { value: valueToSend, from: defaultAccount, gasLimit: 120000})
=======
            .makeGuess(playerGuess, { value: valueToSend, gasLimit: 120000})
>>>>>>> source/main
            await guessing.wait();
        }catch(error){
            alert(error);
            }
        
    } 
    
    async function withdraw(){
        try{
<<<<<<< HEAD
            await contract.withdraw({from:defaultAccount, gasLimit: 100000});
=======
            await contract.withdraw({gasLimit: 100000});
>>>>>>> source/main
        } catch(error){
            alert(error);
        }
    }
    return { joinGame, guess, withdraw };
}