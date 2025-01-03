import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import AuthReducer from "./AuthReducer";
import FileManagerReducer from "./FileManagerReducer";

const rootReducers = combineReducers({
   Auth: AuthReducer,
   Files: FileManagerReducer,
});

const store = configureStore({
   reducer: rootReducers,
});

export default store;
