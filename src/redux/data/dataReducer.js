const initialState = {
  loading: false,
  name: "",
  totalSupply:0,
  maxSupply:0,
  cost: 0,
  preSaleCost:0,
  paused:true,
  preSaleActive:false,
  whitelist:false,
  balance: 0,
  error: false,
  errorMsg: "",
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        name: action.payload.name,
        totalSupply: action.payload.totalSupply,
        maxSupply: action.payload.maxSupply,
        cost: action.payload.cost,
        preSaleCost: action.payload.preSaleCost,
        paused: action.payload.paused,
        preSaleActive: action.payload.preSaleActive,
        whitelist: action.payload.whitelist,
        balance:action.payload.balance,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
