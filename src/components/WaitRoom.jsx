import React from 'react'

const WaitRoom = ({qState}) => {
    return (
        <div className='messageContainer'>
            <h1>Waiting for other users...</h1>
            <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    )
}

export default WaitRoom