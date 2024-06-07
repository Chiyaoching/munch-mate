import api from 'api/auth'
export const SET_USER_MESSAGES = 'SET_USER_MESSAGES';
export const ADD_USER_MESSAGE = 'ADD_USER_MESSAGE';
export const INIT_CONVERSATION = 'INIT_CONVERSATION';

export const send_prompt = (prompt, conversationId) => async (dispatch) => {
  dispatch({type: ADD_USER_MESSAGE, message: {role: 'user', content: prompt}})
  const res = await api.post('/api/prompt/msg', {prompt, conversationId});
  dispatch({type: ADD_USER_MESSAGE, message: res.data.message})
}

export const init_prompt = (prompt) => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api.post('/api/prompt/init', {message: prompt});
      dispatch({type: INIT_CONVERSATION, conversation: res.data})
      resolve(res.data)
    } catch (err) {
      reject(err)
    }
  })
}

export const get_user_conversation = (conversationId) => async (dispatch) => {
  const res = await api.get(`/api/prompt/conversation/${conversationId}`);
  dispatch({type: SET_USER_MESSAGES, conversation: {conversationId, messages: res.data}})
}