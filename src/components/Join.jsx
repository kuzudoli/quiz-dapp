import React from 'react'
import Web3 from 'web3'
const Join = ({question, cost, prize, join, winnerList}) => {
  const web3 = new Web3();
  return (
    <div className='container'>
        <div className='messageContainer'>
          {question.qDesc === "" ? (
            <>
              <h1>There is no challenge yet!</h1>
              {winnerList !== null ? (
                <div style={{marginTop:"100px"}}>
                  <h3>WINNER LIST</h3>
                  {winnerList.map((winner,i) => {
                    return <h4 style={{margin:"5px"}} key={i}>{winner}</h4>
                  })}
                </div>
              ):("")}
            </>
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