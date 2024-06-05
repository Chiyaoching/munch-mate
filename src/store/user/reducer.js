// import { SET_PROMPT } from "./actions";

export const initialState = {
  userInfo: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    // case SET_PROMPT:
    //   return {
    //     ...state,
    //     messages: [...state.messages, action.message]
    //   }
    default:
      return state
  }
}

export default userReducer
