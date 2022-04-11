import React from 'react'

const Hints = ({question, userCount, user}) => {
  return (
    <div className="half-bottom">
      <div className="hint">
          <h3>HINTS</h3>
          <ul className="hintList">
                <li id="firstItem">{question.qHints[0]}</li>
                <li id="secondItem">{question.qHints[1]}</li>
                <li id="lastItem">{question.qHints[2]}</li>
              
          </ul>
      </div>
      <footer className="hint-footer">
        
          <h3 className="hintCount">User Count: {userCount}</h3>
          {user ? (
            <h3 className="answerCount">Answer Count: {user.uAnswerCount}</h3>
          ) : ("")}
        
      </footer>
    </div>
  )
}

export default Hints