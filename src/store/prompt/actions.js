import api from "api/auth";
import { SET_ALERT_OPEN } from "store/actions";
import { ADD_USER_CONVERSATION } from "store/user/actions";

export const ADD_USER_MESSAGE = "ADD_USER_MESSAGE";
export const INIT_CONVERSATION = "INIT_CONVERSATION";
export const IS_LOADING_RESPONSE = "IS_LOADING_RESPONSE";

export const sendPrompt = (prompt, conversationId) => async (dispatch) => {
  try {
    dispatch({ type: IS_LOADING_RESPONSE, isLoading: true });
    dispatch({
      type: ADD_USER_MESSAGE,
      message: { role: "user", content: prompt },
    });
    const res = await api.post("/api/prompt/msg", { prompt, conversationId });
    dispatch({ type: ADD_USER_MESSAGE, message: res.data });
  } catch (err) {
    dispatch({
      type: SET_ALERT_OPEN,
      alertOpen: true,
      alertMsg: err.response.data || err.message,
    });
  } finally {
    dispatch({ type: IS_LOADING_RESPONSE, isLoading: false });
  }
};

export const initPrompt =
  (sysContentIndex, personaTypeIndex) => async (dispatch) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api.post("/api/prompt/init", {
          sysContentIndex,
          personaTypeIndex,
        });
        // update the current conversation content.
        dispatch({
          type: INIT_CONVERSATION,
          conversation: {
            ...res.data,
            messages: JSON.parse(res.data.messages),
          },
        });
        // add to conversation list.
        dispatch({ type: ADD_USER_CONVERSATION, conversation: res.data });
        resolve({ ...res.data, conversationId: res.data._id });
      } catch (err) {
        reject(err);
      }
    });
  };

export const getUserConversation = (conversationId) => async (dispatch) => {
  const res = await api.get(`/api/prompt/conversation/${conversationId}`);
  dispatch({
    type: INIT_CONVERSATION,
    conversation: { _id: conversationId, messages: res.data },
  });
};
