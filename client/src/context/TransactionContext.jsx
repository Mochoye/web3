import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { contractAddress, contractABI } from '../utils/constants.js';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => { 
    const provider =  new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
}

export const TransactionProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState("");
    const [formData, setFormData] = useState({addressTo:'', amount:'', keyword:'', message:''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));


    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
      };
    

    const checkIfWalletIsConnected = async () => {

        try {
            
            if(!ethereum) return alert("Please connect to MetaMask");
            
            const accounts = await ethereum.request({ method: 'eth_accounts' });
    
            if(accounts.length > 0) {
                setCurrentAccount(accounts[0]);
    
                //getAllTransactions();
            } else {
                console.log('No Account found');
            }
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object")
        }
        
            
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

    const sendTransaction = async (transaction) => {
        try{
            if(!ethereum) return alert("Please connect to MetaMask");

            // get the data from the form 

            const{ addressTo, amount, keyword, message } = formData;

            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.parseEther(amount);

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        to: addressTo,
                        from: currentAccount,
                        gas : '0x5208', // 21000
                        value: parsedAmount._hex
                    }
                ]
            });

            // const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword );


            // setIsLoading(true);
            // console.log(`Loading - ${transactionHash.hash}`);
            // await transactionHash.wait();

            // setIsLoading(false);
            // console.log(`Success - ${transactionHash.hash}`);

            // const transactionCount = await transactionContract.getTransactionCount();

            // setTransactionCount(transactionCount.toNumber());
        }   
        catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction }}>
            {children}
        </TransactionContext.Provider>
    );
}