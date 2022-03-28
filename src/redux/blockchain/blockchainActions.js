/* eslint-disable eqeqeq */
// constants
import Web3EthContract from "web3-eth-contract";
import Web3 from "web3";
import NugzNFTs from "../../contracts/NugzNFTs.json";
import { fetchData } from "../data/dataActions";
//import detectEthereumProvider from '@metamask/detect-provider';

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    const { ethereum } = window;
    //const metamaskIsInstalled = ethereum && ethereum.isMetaMask;
    const provider = await Web3.givenProvider;
    if (provider) {
      Web3EthContract.setProvider(ethereum);
      let web3 = new Web3(ethereum);
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await ethereum.request({ method: 'eth_chainId' });
        //const NetworkData = await NugzNFTs.networks[networkId];
        if (networkId !== 4){
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x4' }], // chainId must be in hexadecimal numbers
          });
        }
        const NugzNFTsObj = new Web3EthContract(
          NugzNFTs.abi,
          //NetworkData.address
          "0xAF49DC28Afda011113f563D17eEB2a69db5871CF"
        );
        dispatch(
          connectSuccess({
            account: accounts[0],
            smartContract: NugzNFTsObj,
            web3: web3,
          })
        );
        // Add listeners start
        ethereum.on("accountsChanged", (accounts) => {
          window.location.reload();
          //dispatch(updateAccount(accounts[0]));
        });
        // Add listeners end
      } catch (err) {
        dispatch(connectFailed("Something went wrong"));
      }
    } else {
      window.location = "https://metamask.app.link/dapp/www.DeadCyborgApeClub.io";
      //dispatch(connectFailed("Install Metamask."));
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};

export const disconnect = () => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: null }));
  };
};