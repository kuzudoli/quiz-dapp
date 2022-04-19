import React from 'react'
import { useDispatch } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";

import MetamaskLogo from '../assets/img/metamask.png'

const ConnectButton = () => {
    const dispatch = useDispatch();
    return (
        <div className="container">
            <a href="/connect" className="connect-btn" id='connectBtn' 
                onClick={(e) => {
                    e.preventDefault();
                    dispatch(connect());
                }}>
                <img src={MetamaskLogo} width="30" alt='metamask' />Connect
            </a>
        </div>
    );
}

export default ConnectButton;