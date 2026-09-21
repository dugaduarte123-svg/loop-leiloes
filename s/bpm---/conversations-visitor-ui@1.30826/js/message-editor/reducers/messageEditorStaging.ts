import { removeMessageEditorStagingTextAction, setMessageEditorTextAction } from '../../actions/messageEditorActions';
import { GET_VISITOR_THREADS_SUCCESS } from '../../constants/VisitorActionTypes';
import { getThreadId } from '../../threads/operators/threadGetters';
import { createSlice } from '@reduxjs/toolkit';
const initialState = {};

/**
 * This slice is responsible for managing the staging text for the message editor. It
 * allows each thread to maintain it's own staging text.
 */
const messageEditorStagingSlice = createSlice({
  name: 'messageEditorStaging',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(setMessageEditorTextAction, (state, action) => {
      const {
        threadId,
        stagingText
      } = action.payload;
      state[threadId] = {
        stagingText
      };
    });
    builder.addCase(removeMessageEditorStagingTextAction, (state, action) => {
      const currentThreadId = action.payload;
      const existingThread = state[currentThreadId];
      if (existingThread) {
        state[currentThreadId] = {
          stagingText: ''
        };
      }
    });
    builder.addCase(GET_VISITOR_THREADS_SUCCESS, (state, action) => {
      const {
        threads = []
      } = action.payload;
      threads.forEach(thread => {
        const threadId = getThreadId(thread);
        if (!state[threadId]) {
          state[threadId] = {
            stagingText: ''
          };
        }
      });
    });
  }
});
export default messageEditorStagingSlice.reducer;