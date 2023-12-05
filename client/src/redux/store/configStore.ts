import { legacy_createStore as createStore } from "redux";
import { combineReducers } from "redux";
import locationReducer from "../reducers/locationReducer";
import usernameReducer from "../reducers/usernameReducer";

const rootReducer = combineReducers({
    location: locationReducer,
    username: usernameReducer,
})

const store = createStore(rootReducer);

export default store;
