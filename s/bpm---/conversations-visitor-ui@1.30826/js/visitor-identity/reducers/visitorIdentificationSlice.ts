import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  enabled: false,
  identificationToken: '',
  identificationEmail: ''
};
const visitorIdentificationSlice = createSlice({
  name: 'visitorIdentification',
  initialState,
  reducers: {
    updateVisitorIdentification: (state, action) => {
      const {
        identificationToken,
        identificationEmail
      } = action.payload;
      state.enabled = !!identificationToken;
      state.identificationToken = identificationToken || '';
      state.identificationEmail = identificationEmail || '';
    }
  }
});
export const {
  updateVisitorIdentification
} = visitorIdentificationSlice.actions;
export default visitorIdentificationSlice.reducer;