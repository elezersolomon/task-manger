import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./reducers/taskReducer";
import userReducer from "./reducers/userReducer";
import { subtaskState } from "./reducers/taskReducer";
export const store = configureStore({
  reducer: {
    task: taskReducer,
    user: userReducer,
    subtask:subtaskState,
  },
});
