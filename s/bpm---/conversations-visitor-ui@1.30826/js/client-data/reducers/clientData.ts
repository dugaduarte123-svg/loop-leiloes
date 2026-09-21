import * as ActionTypes from '../../constants/VisitorActionTypes';
import { createSlice } from '@reduxjs/toolkit';
import ClientData from 'conversations-internal-schema/client-data/model/ClientData';
const initialState = ClientData({
  isPubNubClientConnected: true
});
const clientDataSlice = createSlice({
  name: 'clientData',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(ActionTypes.APP_IN_FOREGROUND, state => {
      state.isInForeground = true;
    });
    builder.addCase(ActionTypes.APP_IN_BACKGROUND, state => {
      state.isInForeground = false;
    });
    builder.addCase(ActionTypes.NETWORK_ONLINE, state => {
      state.isPubNubClientConnected = true;
    });
    builder.addCase(ActionTypes.NETWORK_OFFLINE, state => {
      state.isPubNubClientConnected = false;
    });
  }
});
export default clientDataSlice.reducer;