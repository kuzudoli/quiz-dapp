// log
import store from '../store';

const fetchDataRequest = () => {
	return {
		type: 'CHECK_DATA_REQUEST'
	};
};

const fetchDataSuccess = (payload) => {
	return {
		type: 'CHECK_DATA_SUCCESS',
		payload: payload
	};
};

const fetchDataFailed = (payload) => {
	return {
		type: 'CHECK_DATA_FAILED',
		payload: payload
	};
};

export const fetchData = (account) => {
	return async (dispatch) => {
		dispatch(fetchDataRequest());
		try {
			let name = await store.getState().blockchain.smartContract.methods.name().call();
			let totalSupply = await store.getState().blockchain.smartContract.methods.totalSupply().call();
			let maxSupply = await store.getState().blockchain.smartContract.methods.maxSupply().call();
			let cost = await store.getState().blockchain.smartContract.methods.cost().call();
			let preSaleCost = await store.getState().blockchain.smartContract.methods.preSaleCost().call();
			let paused = await store.getState().blockchain.smartContract.methods.paused().call();
			let preSaleActive = await store.getState().blockchain.smartContract.methods.preSaleActive().call();
			let whitelist = await store.getState().blockchain.smartContract.methods.whitelist(store.getState().blockchain.account).call();
			let balance = await store.getState().blockchain.smartContract.methods.getBalance().call();

			dispatch(
				fetchDataSuccess({
					name,
					totalSupply,
					maxSupply,
					cost,
          			preSaleCost,
					paused,
          			preSaleActive,
          			whitelist,
					balance
				})
			);
			console.log(name +":"+ totalSupply +":"+ maxSupply)
		} catch (err) {
			console.log(err);
			dispatch(fetchDataFailed('Could not load data from contract.'));
		}
	};
};
