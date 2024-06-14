import api from "api/auth";

export const SET_USER_INFO = "SET_USER_INFO";
export const REMOVE_USER_INFO = "REMOVE_USER_INFO";
export const SET_USER_CONVERSATIONS = "SET_USER_CONVERSATIONS";
export const ADD_USER_CONVERSATION = "ADD_USER_CONVERSATION";

export const loginUser = (params) => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api.post("/api/auth/login", { ...params });
      localStorage.setItem("token", res.data.token);
      dispatch({ type: SET_USER_INFO });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

export const registerUser = (params) => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      await api.post("/api/auth/register", { ...params });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

export const updateUserSetting = (params) => async (dispatch) => {
  const res = await api.put("/api/auth/setting", { ...params });
  console.log(res.data);
};

export const getUserSetting = () => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api.get("/api/auth/setting");
      dispatch({ type: SET_USER_INFO, userInfo: res.data });
      resolve(res.data);
    } catch (err) {
      reject(err);
    }
  });
};

export const getUserConversations = () => async (dispatch) => {
  const res = await api.get("/api/prompt/conversations");
  dispatch({ type: SET_USER_CONVERSATIONS, conversations: res.data });
};
