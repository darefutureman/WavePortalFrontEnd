import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import abi from './utils/wavePortal.json';
import './App.css';

export default function App() {

  const contractAddress = "0x8A454CB9009b1DAd1E8b2c6b2B770FbBC4cEB83A";
  const contractABI = abi.abi 


  console.log('abi,', contractABI);

   const [account, setAccount] = useState("");

   const [totalWaves, setTotalWaves] = useState(0);

  const checkIfWallectConnected = async () => {

   
      

      try{
        const {ethereum} = window;


       if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

  const accounts = await ethereum.request({method: "eth_accounts"});

    if(accounts.length!=0){

      console.log('account',account);
          setAccount(accounts[0]);
          
    }

    else{
      console.log("No authorized account found");
    }


  }
  
catch(e) {
  console.log(e)
}
     
     
      }


const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const wave =  async () => {
try {

    const {ethereum} = window;

    if(ethereum) {


          const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();
const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

let count = await wavePortalContract.getTotalWaves();
console.log("Retrieved total wave count...", count.toNumber());
// setTotalWaves(count.toNumber());



const waveTxn = await wavePortalContract.wave();
console.log("mining...", waveTxn.hash);

await waveTxn.wait();
console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setTotalWaves(count.toNumber());

    }

    else {
        console.log("Ethereum object doesn't exist!");
      }



    
} catch(e) {
  console.log(error);
}
  }


  useEffect(()=> {
      checkIfWallectConnected();

  }, [])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey Yo!
        </div>

        <div className="bio">
       I am working on solidity!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!account && (
           <button className="waveButton" onClick={connectWallet}>
          Connect Account
        </button>
        )}

        {totalWaves !== 0 && (<button className="waveButton">
          {totalWaves}
        </button>)}
       
      </div>
    </div>
  );
}







