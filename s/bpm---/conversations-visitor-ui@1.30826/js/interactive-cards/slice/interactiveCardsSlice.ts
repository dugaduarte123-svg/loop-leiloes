import { createSlice } from '@reduxjs/toolkit';
import { ASYNC_STATUS } from '../../constants/asyncStatuses';
import { resolveInteractiveCardForMessage } from '../actions/resolveInteractiveCardForMessage';
const initialState = {
  byInstanceId: {}
};
const startedEntry = threadId => ({
  status: ASYNC_STATUS.STARTED,
  threadId,
  cardId: null,
  cardInstanceVersion: 0,
  stateName: null,
  body: null,
  context: {},
  dynamicText: {},
  locale: null,
  errorReason: '',
  pendingActionName: null
});
const interactiveCardsSlice = createSlice({
  name: 'interactiveCards',
  initialState,
  reducers: {
    cardActionPending(state, action) {
      const entry = state.byInstanceId[action.payload.cardInstanceId];
      if (entry) {
        entry.pendingActionName = action.payload.actionName;
        entry.errorReason = '';
      }
    },
    cardResponseReceived(state, action) {
      const entry = state.byInstanceId[action.payload.cardInstanceId];
      if (!entry) {
        return;
      }
      const {
        cardInstanceVersion,
        stateName,
        body,
        context,
        dynamicText,
        locale,
        errorReason
      } = action.payload;
      if (cardInstanceVersion !== undefined) {
        entry.cardInstanceVersion = cardInstanceVersion;
      }
      if (stateName !== undefined) {
        entry.stateName = stateName;
      }
      if (body !== undefined) {
        entry.body = body;
      }
      if (context !== undefined) {
        entry.context = context;
      }
      if (dynamicText !== undefined) {
        entry.dynamicText = dynamicText;
      }
      if (locale !== undefined) {
        entry.locale = locale;
      }
      entry.errorReason = errorReason !== null && errorReason !== void 0 ? errorReason : '';
      entry.pendingActionName = null;
    }
  },
  extraReducers: builder => {
    builder.addCase(resolveInteractiveCardForMessage.pending, (state, action) => {
      const {
        cardInstanceId,
        threadId
      } = action.meta.arg;
      state.byInstanceId[cardInstanceId] = startedEntry(threadId);
    }).addCase(resolveInteractiveCardForMessage.fulfilled, (state, action) => {
      const {
        cardInstanceId,
        threadId,
        cardId,
        cardInstanceVersion,
        stateName,
        body,
        context,
        dynamicText,
        locale
      } = action.payload;
      state.byInstanceId[cardInstanceId] = {
        status: ASYNC_STATUS.SUCCEEDED,
        threadId,
        cardId,
        cardInstanceVersion,
        stateName,
        body,
        context,
        dynamicText,
        locale,
        errorReason: '',
        pendingActionName: null
      };
    }).addCase(resolveInteractiveCardForMessage.rejected, (state, action) => {
      const {
        cardInstanceId
      } = action.meta.arg;
      const entry = state.byInstanceId[cardInstanceId];
      if (entry) {
        entry.status = ASYNC_STATUS.FAILED;
      }
    });
  }
});
export const {
  cardActionPending,
  cardResponseReceived
} = interactiveCardsSlice.actions;
export default interactiveCardsSlice.reducer;