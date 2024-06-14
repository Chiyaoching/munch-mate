import { combineReducers } from "redux";

// reducer import
import customizationReducer from "./customizationReducer";
import promptReducer from "./prompt/reducer";
import userReducer from "./user/reducer";

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
  prompt: promptReducer,
  user: userReducer,
});

export default reducer;
