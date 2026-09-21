import { createSlice } from '@reduxjs/toolkit';
import { onInputFocusAction } from '../../actions/inputEventActions';
const initialState = {
  widgetInputIsOnFocus: false
};
const widgetInputFocusStatusSlice = createSlice({
  name: 'widgetInputFocusStatus',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(onInputFocusAction, (state, action) => {
      state.widgetInputIsOnFocus = action.payload.widgetInputIsOnFocus;
    });
  }
});
export default widgetInputFocusStatusSlice.reducer;