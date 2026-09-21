import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  hasClickedWelcomePagePrompts: false
};
const aiPromptsInteractionSlice = createSlice({
  name: 'aiPromptsInteraction',
  initialState,
  reducers: {
    setHasClickedWelcomePagePrompts: (state, action) => {
      state.hasClickedWelcomePagePrompts = action.payload.hasClicked;
    }
  }
});
export const {
  setHasClickedWelcomePagePrompts
} = aiPromptsInteractionSlice.actions;
export default aiPromptsInteractionSlice.reducer;