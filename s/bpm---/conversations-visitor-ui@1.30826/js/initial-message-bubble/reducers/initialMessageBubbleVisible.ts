import { createSlice } from '@reduxjs/toolkit';

//@ts-ignore untyped-file
import { hasClientTriggers } from '../../client-triggers/operators/hasClientTriggers';
import { getMessage } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import { getPopOpenWelcomeMessage } from '../operators/getPopOpenWelcomeMessage';
import { getPopOpenWidget } from '../operators/getPopOpenWidget';
import { toggleInitialMessageBubble } from '../actions/toggleInitialMessageBubble';
import { receivedWidgetData } from '../../actions/bootstrapWidget';
const initialState = true;
export const isInitialMessageBubbleVisibleSlice = createSlice({
  name: 'isInitialMessageBubbleVisible',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(toggleInitialMessageBubble, (__, action) => {
      const {
        visible
      } = action.payload;
      return visible;
    });
    builder.addCase(receivedWidgetData, (state, action) => {
      const {
        payload
      } = action;
      const clientTriggersEnabled = hasClientTriggers(payload);
      const message = getMessage(payload);
      const openWelcomeMessage = getPopOpenWelcomeMessage(message);
      const popOpenWidget = getPopOpenWidget(message);
      if (popOpenWidget && clientTriggersEnabled) return true;
      if (openWelcomeMessage && clientTriggersEnabled) return false;
      return state;
    });
  }
});
export default isInitialMessageBubbleVisibleSlice.reducer;