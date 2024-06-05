import { SET_PROMPT } from "./actions";

export const initialState = {
  messages: [
    {message: { index: 0, role: 'assistant', content: 'How can I assist you today?' }},
    {message: { index: 0, role: 'user', content: 'who are you?' }},
    {
      message: {
        index: 0,
        role: 'assistant',
        content: 'I am a virtual assistant here to assist and provide information to you. How can I help you today?'
      }
    },
    { message: {index: 0, role: 'user', content: 'when is your last update for your model?' }},
    {
      message: {
        index: 0,
        role: 'assistant',
        content: "I am powered by OpenAI's GPT-3 language model, which was released in June 2020. As an AI assistant, I do not have information on when specific updates to the model were made unless otherwise specified by OpenAI."
      }
    }
  ]
};

const promptReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROMPT:
      return {
        ...state,
        messages: [...state.messages, action.message]
      }
    default:
      return state
  }
}

export default promptReducer
