import React from 'react'
import Web3 from 'web3';

const Question = ({ question,inputEvent,submitEvent }) => {
    const web3 = new Web3(Web3.givenProvider);
    return (
        <div className="half-top">
                <header className="question-header">
                    <h3 id="prize">PRIZE: {web3.utils.fromWei(question.qPrize,"ether")} ETH</h3>
                    <h3 id="time">{new Date(question.qDate*1000).toLocaleString()}</h3>
                </header>
                <main>
                    <div className="question">
                        <p>{question.qDesc}</p>
                    </div>
                    <div className="answer">
                        <input id="answerInput" type="text" onInput={inputEvent} />
                        <button id="answerSubmit" type="submit" onClick={submitEvent}>SUBMIT</button>
                    </div>
                </main>
        </div>
    )
}

export default Question;