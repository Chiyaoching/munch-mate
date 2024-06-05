import axios from 'axios'
export const SET_PROMPT = 'SET_PROMPT';


export const send_prompt = (prompt) => async (dispatch) => {
  dispatch({type: SET_PROMPT, message: {message: {role: 'user', content: prompt}}})
  const res = await axios.post('/api/prompt/msg', {message: prompt});
  console.log(res.data)
  dispatch({type: SET_PROMPT, message: res.data})
}

export const init_prompt = (prompt) => async (dispatch) => {
  const res = await axios.post('/api/prompt/init', {message: prompt});
  console.log(res.data)
  dispatch({type: SET_PROMPT, message: res.data})
}