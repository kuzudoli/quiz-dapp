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
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);//string
  const [challengeCost, setChallengeCost] = useState(null)//integer
  const [smartContract, setSmartContract] = useState(null);//string
  const [user, setUser] = useState(null);//object 
  const [question,setQuestion] = useState("Question not found!");//object
  const [userCount,setUserCount] = useState(0);//integer
  const [userAnswer,setUserAnswer] = useState(null);//string
  const [winnerList, setWinnerList] = useState(null);
  const [answerState, setAnswerState] = useState(null);
  
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

        let winnerList = await smartContract.methods.getWinners().call();
        setWinnerList(winnerList);

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
      if(localStorage.getItem("aState")){
        setAnswerState(localStorage.getItem("aState"))
        console.log(answerState);
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
      setLoading(true);
      const aState = await smartContract.methods.checkAnswer(userAnswer).call({from:account})
      await smartContract.methods.checkAnswer(userAnswer).send({from:account})
      if(aState){
        document.getElementById("myModal").style.display="block";
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  //Join Challenge
  const joinChallenge = async () => {
    try {
      setLoading(true)
      await smartContract.methods.joinChallenge().send({from: account, value: challengeCost})
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
    setLoading(false)
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
        winnerList={winnerList}
      />
    )
  }
}

export default App;
