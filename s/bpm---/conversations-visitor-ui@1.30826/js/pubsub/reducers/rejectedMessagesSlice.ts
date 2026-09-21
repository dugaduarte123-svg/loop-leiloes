import { createSlice } from '@reduxjs/toolkit';
const initialState = {};
const rejectedMessagesSlice = createSlice({
  name: 'rejectedMessages',
  initialState,
  reducers: {
    setRejectedMessage(state, action) {
      const {
        rejectedMessageId,
        rejectionReason,
        threadId
      } = action.payload;
      state[rejectedMessageId] = {
        rejectionReason,
        threadId
      };
    },
    clearAllRejectedMessages() {
      return initialState;
    },
    removeRejectedMessagesForThread(state, action) {
      const {
        threadId
      } = action.payload;
      Object.entries(state).forEach(([id, info]) => {
        if (info.threadId === threadId) {
          delete state[id];
        }
      });
    }
  }
});
export const {
  setRejectedMessage,
  clearAllRejectedMessages,
  removeRejectedMessagesForThread
} = rejectedMessagesSlice.actions;
export default rejectedMessagesSlice.reducer;