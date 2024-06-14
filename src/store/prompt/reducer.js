import {
  INIT_CONVERSATION,
  ADD_USER_MESSAGE,
  IS_LOADING_RESPONSE,
} from "./actions";

export const initialState = {
  messages: [],
  isLoading: false,
  currConversationId: null,
};

const promptReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_USER_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.message],
      };
    case INIT_CONVERSATION:
      return {
        ...state,
        currConversationId: action.conversation._id,
        messages: action.conversation.messages,
      };
    case IS_LOADING_RESPONSE:
      return {
        ...state,
        isLoading: action.isLoading
      }
    default:
      return state;
  }
};

export default promptReducer;
