import get from 'transmute/get';
import { createAction } from '@reduxjs/toolkit';
import { selectThread } from '../selected-thread/actions/selectThread';
import { STUBBED_THREAD_ID } from '../threads/constants/stubbedThreadId';
import { GET_WIDGET_DATA_SUCCEEDED, RECEIVED_WIDGET_SHELL_DATA } from '../constants/VisitorActionTypes';
import { trackInteraction } from '../usage-tracking/actions/trackInteraction';
import { EVENT_NAMES, EVENT_SAMPLE_RATES } from '../usage-tracking/constants/eventNames';
// @ts-ignore not typed
import { buildWidgetData } from '../widget-data/operators/buildWidgetData';
// @ts-ignore not typed
import { bootstrapInitialWidgetUi } from '../initial-message-bubble/actions/bootstrapInitialWidgetUi';
// @ts-ignore not typed
import { messageCookieHandler } from '../gdpr/operators/messageCookieHandler';
import { trackPageViewMetric } from '../usage-tracking/utils/trackMetric';

// @ts-ignore not typed

import { getIsOpen } from '../selectors/getIsOpen';
import { getIsWidgetInAwayMode } from '../availability/selectors/getIsWidgetInAwayMode';
export const receivedWidgetData = createAction(GET_WIDGET_DATA_SUCCEEDED, widgetData => ({
  payload: widgetData
}));
export const receivedWidgetShellData = createAction(RECEIVED_WIDGET_SHELL_DATA, widgetData => ({
  payload: widgetData
}));
export default function bootstrapWidget(data) {
  return (dispatch, getState) => {
    trackPageViewMetric();
    const widgetData = buildWidgetData(data);
    if (!get('sessionId', widgetData) || !get('chatflowId', widgetData)) {
      return;
    }
    dispatch(selectThread(STUBBED_THREAD_ID));
    messageCookieHandler({
      currentState: getState(),
      widgetData
    });
    dispatch(receivedWidgetData(widgetData));
    dispatch(receivedWidgetShellData(data));
    dispatch(bootstrapInitialWidgetUi(widgetData));
    const currentState = getState();
    const isOpen = getIsOpen(currentState);
    const away = getIsWidgetInAwayMode(currentState);
    if (Math.random() < EVENT_SAMPLE_RATES.PAGE_VIEW) {
      dispatch(trackInteraction(EVENT_NAMES.PAGE_VIEW, {
        screen: 'widget',
        action: 'rendered widget',
        away,
        isOpen,
        sampleRate: EVENT_SAMPLE_RATES.PAGE_VIEW
      }));
    }
  };
}