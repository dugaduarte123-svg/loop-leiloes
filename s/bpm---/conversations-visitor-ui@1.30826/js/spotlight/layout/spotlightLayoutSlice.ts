import { createSlice } from '@reduxjs/toolkit';
import { SPOTLIGHT_LAYOUT_CENTERED } from './SpotlightLayoutOption';
const initialState = {
  layout: SPOTLIGHT_LAYOUT_CENTERED
};
const spotlightLayoutSlice = createSlice({
  name: 'spotlightLayout',
  initialState,
  reducers: {
    setSpotlightLayout(state, action) {
      state.layout = action.payload;
    }
  }
});
export const {
  setSpotlightLayout
} = spotlightLayoutSlice.actions;
export default spotlightLayoutSlice.reducer;