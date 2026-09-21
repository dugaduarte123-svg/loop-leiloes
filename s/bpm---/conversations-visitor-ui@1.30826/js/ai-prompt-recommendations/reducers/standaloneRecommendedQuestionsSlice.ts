import { createSlice } from '@reduxjs/toolkit';
import { UNINITIALIZED, PENDING, SUCCEEDED } from 'conversations-internal-schema/constants/RequestStatusTypes';
import { fetchStandalonePromptRecommendations } from '../actions/fetchStandalonePromptRecommendations';
const initialState = {
  questions: [],
  status: UNINITIALIZED
};
const standalonePromptRecommendationsSlice = createSlice({
  name: 'standalonePromptRecommendations',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchStandalonePromptRecommendations.pending, state => {
      state.status = PENDING;
    }).addCase(fetchStandalonePromptRecommendations.fulfilled, (state, action) => {
      state.questions = action.payload;
      state.status = SUCCEEDED;
    }).addCase(fetchStandalonePromptRecommendations.rejected, state => {
      state.status = UNINITIALIZED;
    });
  }
});
export default standalonePromptRecommendationsSlice.reducer;