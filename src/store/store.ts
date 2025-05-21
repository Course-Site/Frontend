import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import topicReducer from "./topicSlice";
import lectureReducer from "./lectureSlice";
import labReducer from "./labSlice";
import testReducer from "./testSlice"
import learningReducer from "./learningSlice"
import userTestStatisticsReducer from "./testStatistic"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    topic: topicReducer,
    lecture: lectureReducer,
    lab: labReducer,
    test: testReducer,
    learning: learningReducer,
    userTestStatistics: userTestStatisticsReducer,
  },
});

// Типизация RootState и Dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
