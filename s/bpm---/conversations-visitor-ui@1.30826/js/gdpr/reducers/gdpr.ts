import { createSlice } from '@reduxjs/toolkit';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import { REFRESH_WIDGET_DATA } from '../../widget-data/constants/actionTypes';
import { CREATE_NEW_THREAD } from '../../thread-create/constants/actionTypes';
import { SHOULD_NOT_ASK_FOR_CONSENT } from 'conversations-internal-schema/widget-data/records/GDPRConsentToProcessStatusTypes';
import { getGDPRConsentToProcessStatus } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
//@ts-ignore untyped-file
import { saveConsentToProcess } from '../actions/visitorConsentsToProcess';
const initialState = {
  consentToProcessStatus: SHOULD_NOT_ASK_FOR_CONSENT,
  consentToProcessError: false
};
const gdprSlice = createSlice({
  name: 'gdpr',
  initialState,
  reducers: {
    setConsentToProcessStatus(state, action) {
      state.consentToProcessStatus = action.payload;
    },
    setConsentToProcessError(state, action) {
      state.consentToProcessError = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(saveConsentToProcess.fulfilled, state => {
      state.consentToProcessStatus = SHOULD_NOT_ASK_FOR_CONSENT;
      state.consentToProcessError = false;
    }).addCase(saveConsentToProcess.rejected, state => {
      state.consentToProcessError = true;
    }).addCase(ActionTypes.GET_WIDGET_DATA_SUCCEEDED, (state, action) => {
      state.consentToProcessStatus = getGDPRConsentToProcessStatus(action.payload);
    }).addCase(REFRESH_WIDGET_DATA, (state, action) => {
      state.consentToProcessStatus = getGDPRConsentToProcessStatus(action.payload);
    }).addCase(CREATE_NEW_THREAD.SUCCEEDED, state => {
      state.consentToProcessStatus = SHOULD_NOT_ASK_FOR_CONSENT;
    });
  }
});
export const {
  setConsentToProcessStatus,
  setConsentToProcessError
} = gdprSlice.actions;
export default gdprSlice.reducer;