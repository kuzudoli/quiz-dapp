import React from 'react'
import Web3 from 'web3'
const Join = ({question, cost, prize, join}) => {
  const web3 = new Web3();
  return (
    <div className='container'>
        <div className='messageContainer'>
          {question.qDesc === "" ? (
            <h1>There is no challenge yet!</h1>
          ) : (
            <>
              <h1>You're not joined!</h1>
              <div className='info'>
                <h2>Cost: {web3.utils.fromWei(cost.toString(),"ether")} ETH</h2>
                <h2>Prize: {web3.utils.fromWei(prize.toString(),"ether")} ETH</h2>
              </div>
              <a href="/#" className="connect-btn" id='joinBtn' 
                  style={{
                    pointerEvents:question.qDesc === "" ? "none" : "all", 
                    opacity:question.qDesc === "" ? "0.5" : "1"}} onClick={join}>Join Now!</a>
            </>
          )}
        </div>
    </div>
  )
}

export default Join