import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import AuthReducer from "./AuthReducer";

const rootReducers = combineReducers({
   Auth: AuthReducer,
});

const store = configureStore({
   reducer: rootReducers,
});

export default store;
