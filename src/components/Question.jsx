import React from 'react'
import Web3 from 'web3';

const Question = ({ question,inputEvent,submitEvent}) => {
    const web3 = new Web3(Web3.givenProvider);
    return (
        <>
            <div id="myModal" className="modal">
                <div className="modal-content">
                    <span className="close" onClick={() => {
                        document.getElementById("myModal").style.display="none";
                        window.location.reload();
                    }}>&times;</span>
                    <h1>🎉Congratulations🎉</h1>
                    <h1>Check your wallet for your prize</h1>
                </div>
            </div>
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
        </>
    )
}

export default Question;