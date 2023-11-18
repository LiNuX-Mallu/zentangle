import { legacy_createStore as createStore } from "redux";
import locationReducer from "../reducers/locationReducer";

const store = createStore(locationReducer);

export default store;
