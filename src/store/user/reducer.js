import {
  SET_USER_INFO,
  REMOVE_USER_INFO,
  SET_USER_CONVERSATIONS,
  ADD_USER_CONVERSATION,
} from "./actions";

export const initialState = {
  userInfo: null,
  conversations: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_INFO:
      let payload = action?.userInfo;
      if (!payload) {
        const token = localStorage.getItem("token");
        payload = JSON.parse(atob(token.split(".")[1]));
      }
      return {
        ...state,
        userInfo: { ...state.userInfo, ...payload },
      };
    case REMOVE_USER_INFO:
      localStorage.removeItem("token");
      return {
        ...state,
        userInfo: null,
      };
    case SET_USER_CONVERSATIONS:
      return {
        ...state,
        conversations: action.conversations.reverse(),
      };
    case ADD_USER_CONVERSATION:
      return {
        ...state,
        conversations: [action.conversation, ...state.conversations],
      };
    default:
      return state;
  }
};

export default userReducer;
