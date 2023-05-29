import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const taskSlice = createSlice({
  name: "task",
  initialState: {
    value: { ...initialState },
  },
  reducers: {
    taskDetail: (state, action) => {
      state.value = action.payload;
    },
  },
});


 const subTaskSlice = createSlice({
  name: "subtask",
  initialState: {
    value: { ...initialState },
  },
  reducers: {
    subTaskDetail: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { taskDetail } = taskSlice.actions;
export const { subTaskDetail } = subTaskSlice.actions;
export const subtaskState = subTaskSlice.reducer 
export default taskSlice.reducer;
