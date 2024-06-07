import { 
  SET_USER_INFO, 
  REMOVE_USER_INFO, 
  SET_USER_CONVERSATIONS 
} from "./actions";

export const initialState = {
  userInfo: null,
  conversations: []
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_INFO:
      const token = localStorage.getItem('token')
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        ...state,
        userInfo: {...state.userInfo, ...payload}
      }
    case REMOVE_USER_INFO:
      localStorage.removeItem('token')
      return {
        ...state,
        userInfo: null
      }
    case SET_USER_CONVERSATIONS:
      return {
        ...state,
        conversations: action.conversations.reverse()
      }
    default:
      return state
  }
}

export default userReducer
