import axios from 'axios'


export const login_user = (params) => async (dispatch) => {
  // dispatch({type: SET_PROMPT, message: {message: {role: 'user', content: prompt}}})
  const res = await axios.post('/api/auth/login', {...params});
  localStorage.setItem('token', res.data.token);
  console.log(res.data)
  // dispatch({type: SET_PROMPT, message: res.data})
}

export const register_user = (params) => async (dispatch) => {
  const res = await axios.post('/api/auth/register', {...params});
  console.log(res.data)
  // dispatch({type: SET_PROMPT, message: res.data})
}