/* eslint-disable eqeqeq */
import Web3EthContract from "web3-eth-contract";
import Web3 from "web3";
import SmartContract from "../../contracts/SmartContract.json";
import { fetchData } from "../data/dataActions";

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
    const provider = await Web3.givenProvider;

    if (provider) {
      
      Web3EthContract.setProvider(ethereum);
      let web3 = new Web3(ethereum);

      try {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        const networkId = await ethereum.request({ method: 'eth_chainId' });

        if (networkId !== 4){
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x4' }], // chainId must be in hexadecimal numbers
          });
        }

        const SmartContractObj = new Web3EthContract(
          SmartContract.abi,
          SmartContract.networks["4"].address
        );

        dispatch(
          connectSuccess({
            account: accounts[0],
            smartContract: SmartContractObj,
            web3: web3,
          })
        );
        ethereum.on("accountsChanged", (accounts) => {
          window.location.reload();
        });
        // Add listeners end
      } catch (err) {
        dispatch(connectFailed("Something went wrong"));
      }
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};