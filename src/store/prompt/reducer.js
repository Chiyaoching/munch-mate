import { 
  SET_USER_MESSAGES, 
  INIT_CONVERSATION,
  ADD_USER_MESSAGE 
} from "./actions";

export const initialState = {
  messages: [],
  currConversationId: null
};

const promptReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_USER_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.message]
      }
    case INIT_CONVERSATION:
      return {
        ...state,
        currConversationId: action.conversation.conversationId,
        messages: action.conversation.messages
      }
    case SET_USER_MESSAGES:
      return {
        ...state,
        currConversationId: action.conversation.conversationId,
        messages: action.conversation.messages
      }
    default:
      return state
  }
}

export default promptReducer
