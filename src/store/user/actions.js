import api from 'api/auth'

export const SET_USER_INFO = 'SET_USER_INFO'
export const REMOVE_USER_INFO = 'REMOVE_USER_INFO'
export const SET_USER_CONVERSATIONS = 'SET_USER_CONVERSATIONS'

export const login_user = (params) => async (dispatch) => {
  const res = await api.post('/api/auth/login', {...params});
  localStorage.setItem('token', res.data.token);
  dispatch({type: SET_USER_INFO})
}

export const register_user = (params) => async (dispatch) => {
  const res = await api.post('/api/auth/register', {...params});
  console.log(res.data)
}

export const update_user_setting = (params) => async (dispatch) => {
  const res = await api.put('/api/auth/setting', {...params});
  console.log(res.data)
}

export const get_user_setting = () => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api.get('/api/auth/setting');
      dispatch({type: SET_USER_INFO, userInfo: res.data})
      resolve(res.data)
    } catch (err) {
      reject(err)
    }
  })
}

export const get_user_conversations = () => async (dispatch) => {
  const res = await api.get('/api/prompt/conversations');
  dispatch({type: SET_USER_CONVERSATIONS, conversations: res.data})
}

