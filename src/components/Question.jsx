import React from 'react'
import Web3 from 'web3';

const Question = ({ question,inputEvent,submitEvent,loading}) => {
    const web3 = new Web3(Web3.givenProvider);
    let countDownDate = question.qDate;
    setInterval(function() {
        let now = new Date().getTime();
        let timeleft = countDownDate - now;
    
        let days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
        let hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

        if(timeleft<0){
            console.log("timeout!");
        }
        else{
            document.getElementById("time").innerHTML = days + ":" + hours + ":" + minutes +  ":" + seconds;
        }
    }, 1000);
    return (
        <>
            <div id="winModal" className="modal">
                <div className="modal-content">
                    <span className="close" onClick={() => {
                        document.getElementById("winModal").style.display="none";
                        window.location.reload();
                    }}>&times;</span>
                    <h1>🎉Congratulations🎉</h1>
                    <h1>Check your wallet for your prize</h1>
                </div>
            </div>
            <div id="answerCountModal" className="modal">
                <div className="modal-content">
                    <span className="close" onClick={() => {
                        document.getElementById("answerCountModal").style.display="none";
                        window.location.reload();
                    }}>&times;</span>
                    <h1>You can't answer anymore, sorry 😥</h1>
                </div>
            </div>
            <div className="half-top">
                    <header className="question-header">
                        <h3 id="prize">PRIZE: {web3.utils.fromWei(question.qPrize,"ether")} ETH</h3>
                        {/* <h3 id="time">{new Date(question.qDate*1000).toLocaleString()}</h3> */}
                        <h3 id="time">time</h3>
                    </header>
                    <main>
                        <div className="question">
                            <p>{question.qDesc}</p>
                        </div>
                        <div className="answer" style={{opacity:loading?"0.5":"1",pointerEvents:loading?"none":"all"}}>
                            <input id="answerInput" type="text" onInput={inputEvent} />
                            <button id="answerSubmit" type="submit" onClick={submitEvent}>SUBMIT</button>
                        </div>
                    </main>
            </div>
        </>
    )
}

export default Question;