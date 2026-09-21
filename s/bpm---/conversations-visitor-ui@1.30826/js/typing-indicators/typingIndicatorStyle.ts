import { createSlice } from '@reduxjs/toolkit';
const initialState = {};
const typingIndicatorStyleSlice = createSlice({
  name: 'typingIndicatorStyle',
  initialState,
  reducers: {
    setTypingIndicatorStyle: (state, action) => {
      const {
        threadId,
        senderId,
        style,
        shouldDisableUserInput,
        label
      } = action.payload;
      if (!state[threadId]) {
        state[threadId] = {};
      }
      state[threadId][senderId] = {
        style,
        shouldDisableUserInput,
        label
      };
    },
    clearTypingIndicatorStyle: (state, action) => {
      const {
        threadId,
        senderId
      } = action.payload;
      if (state[threadId]) {
        delete state[threadId][senderId];
      }
    },
    clearAllTypingIndicatorStylesForThread: (state, action) => {
      const {
        threadId
      } = action.payload;
      delete state[threadId];
    }
  }
});
export const {
  setTypingIndicatorStyle,
  clearTypingIndicatorStyle,
  clearAllTypingIndicatorStylesForThread
} = typingIndicatorStyleSlice.actions;
export default typingIndicatorStyleSlice.reducer;