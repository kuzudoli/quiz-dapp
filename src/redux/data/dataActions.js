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
			let challengeCost = await store.getState().blockchain.smartContract.methods.challengeCost().call();
			let challengeAnswerCount = await store.getState().blockchain.smartContract.methods.challengeAnswerCount().call();
			let waitUserCount = await store.getState().blockchain.smartContract.methods.waitUserCount().call();
			let question = await store.getState().blockchain.smartContract.methods.getQuestion().call();
			// let whitelist = await store.getState().blockchain.smartContract.methods.whitelist(store.getState().blockchain.account).call();

			// console.log(question);

			dispatch(
				fetchDataSuccess({
					challengeCost,
					challengeAnswerCount,
					waitUserCount,
					question
				})
			);
		} catch (err) {
			console.log(err);
			dispatch(fetchDataFailed('Could not load data from contract.'));
		}
	};
};
