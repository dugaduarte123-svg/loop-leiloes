import { createSlice } from '@reduxjs/toolkit';
const initialState = {};
const availabilityAutoReplyMessageTimeoutsSlice = createSlice({
  name: 'availabilityAutoReplyMessageTimeouts',
  initialState,
  reducers: {
    addAvailabilityAutoReplyMessageTimeout(state, action) {
      state[action.payload.channel] = action.payload.timeout;
    }
  }
});
export const {
  addAvailabilityAutoReplyMessageTimeout
} = availabilityAutoReplyMessageTimeoutsSlice.actions;
export default availabilityAutoReplyMessageTimeoutsSlice.reducer;