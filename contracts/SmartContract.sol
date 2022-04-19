// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Question.sol";
import "./User.sol";

contract SmartContract is Ownable{
    uint public challengeCost = 0.0001 ether;
    uint public challengePrize = 0.0002 ether;
    uint public challengeAnswerCount = 2;
    uint public waitUserCount = 2;
    
    Question public newQuestion;
    User[] public Users;
    //mapping(address => User) ParticipantMap;
    address[] public Winners;

    //Creates Question
    function createQuestion(
        string memory _desc, 
        uint _date, 
        string[3] memory _hints,
        string memory _answer) public onlyOwner()
    {
        newQuestion = Question(_desc, challengePrize, _date, _hints, _answer, false, true);

        clearUsers();
    }

    function getQuestion() public view returns(Question memory)
    {
        return newQuestion;
    }

    function getUsers() public view returns(User[] memory)
    {
        return Users;
    }

    function getWinners() public view returns(address[] memory)
    {
        return Winners;
    }

    function clearUsers() public {
        //If users exist, clean up
        if(Users.length > 0){
            for(uint i=0;i<=Users.length;i++){
                Users.pop();
            }
        }
    }
    //Joins Challenge
    function joinChallenge() public payable
    {
        //Is challenge started or waiting participant?
        require((newQuestion.qState && !newQuestion.qWait) || (!newQuestion.qState && newQuestion.qWait), "Challenge not started yet!");
        //Is Participant exist?
        require(!checkParticipant(msg.sender).isJoined, "User is already joined!");
        require(msg.value >= challengeCost, "MATIC value sent not valid!");

        User memory newUser = User(msg.sender, 0, challengeAnswerCount, true);
        Users.push(newUser);

        if(Users.length >= waitUserCount){
            newQuestion.qState = true;
            newQuestion.qWait = false;
        }
    }
    
    //Checks Answer
    function checkAnswer(string memory _answer) public payable returns(bool)
    {   
        //Is challenge started or waiting participant?
        require(newQuestion.qState && !newQuestion.qWait, "Challenge not started yet!");
        //Is Participant exist?
        require(checkParticipant(msg.sender).isJoined, "User not joined!");
        require(checkParticipant(msg.sender).uAnswerCount > 0, "User has not answer count, enough!");


        //If answer true, stop the challenge and send the coin to winner
        if(keccak256(abi.encodePacked(newQuestion.qAnswer)) == keccak256(abi.encodePacked(_answer)))
        {
            //Sending prize to winner
            payable(msg.sender).transfer(newQuestion.qPrize);//0,00001

            //Challenge is ending
            newQuestion.qDesc = "";
            newQuestion.qPrize = 0;
            newQuestion.qDate = 0;
            newQuestion. qHints = ["","",""];
            newQuestion.qAnswer = "";
            newQuestion.qState = false;
            newQuestion.qWait = false;

            //Participants cleaning
            clearUsers();

            //Only the last 10 winner storing
            if(Winners.length == 10){
                for(uint i=0;i<10;i++)
                    Winners.pop();
            }
            Winners.push(msg.sender);
            return true;   
        }
        else{
            //Decreasing msg.sender answer count
            for(uint i=0;i<Users.length;i++){
                if(Users[i].uWallet == checkParticipant(msg.sender).uWallet)
                    Users[i].uAnswerCount--;
            }
            return false;
        }
    }

    function checkParticipant(address _userAddress) public view returns(User memory)
    {
        User memory user;
        for(uint i=0; i<Users.length; i++)
        {
            //If user exist and joined
            if(Users[i].uWallet == _userAddress && Users[i].isJoined)
                user = Users[i];
        }
        return user;
    }

    function isUserJoined(address _userAddress) public view returns(bool){
        for(uint i=0; i<Users.length; i++)
        {
            //If user exist and joined
            if(Users[i].uWallet == _userAddress && Users[i].isJoined)
                return true;
        }
        return false;
    }
    
    //Parameter type is must be wei
    function withdraw(uint _amount) public onlyOwner() {
        payable(msg.sender).transfer(_amount);
    }

    /*Set Functions*/
    function changeStartedState() public onlyOwner()
    {
        newQuestion.qState = !newQuestion.qState;
    }

    function changeWaitingState() public onlyOwner()
    {
        newQuestion.qWait = !newQuestion.qWait;
    }

    function setChallengeCost(uint _newCost) public onlyOwner(){
        challengeCost = _newCost;
    }

    function setAnswerCount(uint _newCount) public onlyOwner(){
        challengeAnswerCount = _newCount;
    }

    function setWaitUserCount(uint _newCount) public onlyOwner(){
        waitUserCount = _newCount;
    }
    /*Set Functions END*/
}