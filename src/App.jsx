import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from './utils/wavePortal.json';
import './App.css';

export default function App() {

  const contractAddress = "0xc382E10209CBd257ACFE2eD527Ba1f51DA172129";
  const contractABI = abi.abi;
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState("Hi, I just want to say I miss ya! ");
  const [loading, setLoading] = useState(true);
  // cnst 



  // console.log('abi,', contractABI);

  const [account, setAccount] = useState("");

  const [totalWaves, setTotalWaves] = useState(0);

  const checkIfWallectConnected = async () => {

    try {
      const { ethereum } = window;


      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length != 0) {

        console.log('account', account);
        setAccount(accounts[0]);
        getAllWaves();

      }

      else {
        console.log("No authorized account found");
      }


    }

    catch (e) {
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

  const wave = async () => {
    try {

      const { ethereum } = window;

      if (ethereum) {

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        

        let count = await wavePortalContract.getTotalWaves();
        
        console.log("Retrieved total wave count...", count.toNumber());
        // setTotalWaves(count.toNumber());



        const waveTxn = await wavePortalContract.wave(message);
        setLoading(true);
        console.log("mining...", waveTxn.hash);

        await waveTxn.wait();

        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setTotalWaves(count.toNumber());
        await getAllWaves();
        setLoading(false);

      }

      else {
        console.log("Ethereum object doesn't exist!");
        setLoading(false);
      }




    } catch (e) {
      console.log(error);
    }
  }


  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
        setTotalWaves(wavesCleaned.length);
        setLoading(false);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }




  useEffect(() => {
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
        <hr />
        <textarea onChange={e => setMessage(e.target.value)} value={message}
          rows={5}
          cols={5}
          className="textArea"
        />





        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!account && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Account
        </button>
        )}
        {!loading ? (<button className="waveButton">
          {totalWaves}  Waves
        </button>) : (<div>loading...</div>)}


        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}



      </div>
    </div>
  );
}






