import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import learningReducer from "./learningSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    learning: learningReducer,
  },
});

// Типизация RootState и Dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
