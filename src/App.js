import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchData } from "./redux/data/dataActions";
import Web3 from "web3";

import SmartContract from './contracts/SmartContract.json'

import { ConnectButton, Question, Hints, Join, WaitRoom } from './components/index';

import './App.css'

function App() {
  // const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  // const data = useSelector((state) => state.data);
  // const web3 = new Web3(Web3.givenProvider);

  const [account, setAccount] = useState(null);
  const [challengeCost, setChallengeCost] = useState(null)
  const [smartContract, setSmartContract] = useState(null);
  const [user, setUser] = useState(null);
  const [question,setQuestion] = useState("Question not found!");
  const [userCount,setUserCount] = useState(0);
  const [userAnswer,setUserAnswer] = useState(null);

  //Data load
  const loadBlockchainData = async () => {
    if (typeof window.ethereum !== 'undefined') {
      
      const web3 = new Web3(window.ethereum)
			const accounts = await web3.eth.getAccounts()
      
			if (accounts.length > 0) {
				setAccount(accounts[0])
			}
      
			const networkId = await web3.eth.net.getId()

			if(networkId === 4){
        const smartContract = new web3.eth.Contract(SmartContract.abi, SmartContract.networks[networkId].address)
        setSmartContract(smartContract)
        
        const question = await smartContract.methods.getQuestion().call()
        setQuestion(question)

        const cost = await smartContract.methods.challengeCost().call()
        setChallengeCost(cost)

        const usersCount = await smartContract.methods.getUsers().call();
        setUserCount(usersCount.length)

        if(account){
          const user = await smartContract.methods.checkParticipant(web3.utils.toChecksumAddress(account)).call();
          if(user.uWallet !== "0x0000000000000000000000000000000000000000"){
            setUser(user);
          }else{
            setUser(null);
          }
          //console.log(user);
        }
      }
			window.ethereum.on('accountsChanged', function (accounts) {
        setAccount(accounts[0])
        window.location.reload();
			})

			window.ethereum.on('chainChanged', (chainId) => {
				window.location.reload();
			})
		}
	}
  
  //Get input value
  const getUserAnswer = () => {
    const answer = document.getElementById("answerInput").value;
    setUserAnswer(answer);
  }

  //Check answer
  const checkAnswer = async () => {
    try {
      await smartContract.methods.checkAnswer(userAnswer).send({from: account})
    } catch (error) {
      console.log(error);
    }
  }

  //Join Challenge
  const joinChallenge = async () => {
    try {
      await smartContract.methods.joinChallenge().send({from: account, value: challengeCost})
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    //getData()
    loadBlockchainData()
  },[account]);
  

  if(blockchain.account === null && blockchain.smartContract === null){
    return(
      <ConnectButton/>
    );
  }

  
  if(user){
    if(user.isJoined && question.qState){
      return(
        <div className="container">
          <Question 
            question={question}
            inputEvent={getUserAnswer}
            submitEvent={checkAnswer}
            />
          <Hints
            userCount={userCount}
            question={question}
            user={user}
            />
        </div>
      )
    }else{
      return(
        <div className="container">
          <WaitRoom
            qState={question.qState}
          />
        </div>
      )
    }
  }else{
    return(
      <Join
        question={question}
        cost={challengeCost}
        prize={question.qPrize}
        join={joinChallenge}
      />
    )
  }
  
  
}

export default App;
