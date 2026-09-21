import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  title: '',
  description: '',
  timezone: ''
};
const MAX_LENGTH = 2048;
const entryUrlMetadataSlice = createSlice({
  name: 'entryUrlMetadata',
  initialState,
  reducers: {
    setEntryUrlMetadata(state, action) {
      if (action.payload.title !== state.title) {
        state.title = action.payload.title.substring(0, MAX_LENGTH);
      }
      if (action.payload.description !== state.description) {
        state.description = action.payload.description.substring(0, MAX_LENGTH);
      }
      if (action.payload.timezone !== state.timezone) {
        state.timezone = action.payload.timezone;
      }
    }
  }
});
export const {
  setEntryUrlMetadata
} = entryUrlMetadataSlice.actions;
export default entryUrlMetadataSlice.reducer;