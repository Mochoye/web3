import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { contractAddress, contractABI } from '../utils/constants.js';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => { 
    const provider = new ethers.provider.Web3Provided(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    console.log({
        provider,
        signer,
        transactionContract
    });
}

export const TransactionProvider = ({ children }) => {

    const [connectedAccount, setConnectedAccount] = useState(initialState);
    
    

    const checkIfWalletIsConnected = async () => {
        if(!ethereum) return alert("Please connect to MetaMask");
        
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        console.log(accounts);
            
    }

    const connectWallet = async () => {
        try{
            if(!ethereum) return alert("Please connect to MetaMask");

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

            setCurrentAccount(accounts[0]);
        }
        catch (error) {
            console.log(error);

            throw new Error("No ethereum object")
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <TransactionContext.Provider value={{ connectWallet }}>
            {children}
        </TransactionContext.Provider>
    );
}