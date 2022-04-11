const initialState = {
  loading: false,
  name: "",
  challengeCost: 0,
  challengeAnswerCount: 0,
  waitUserCount: 0,
  question: null,
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
        challengeCost: action.payload.challengeCost,
        challengeAnswerCount: action.payload.challengeAnswerCount,
        waitUserCount: action.payload.waitUserCount,
        question: action.payload.question,
        user: action.payload.user,
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
