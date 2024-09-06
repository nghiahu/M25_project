import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";


const store = configureStore({
  reducer: {
    users: userReducer
  }
});
export default store;
export type Rootype = ReturnType<typeof store.getState>