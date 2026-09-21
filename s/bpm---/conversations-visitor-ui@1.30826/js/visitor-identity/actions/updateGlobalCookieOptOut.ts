import { createAction } from '@reduxjs/toolkit';
import { localStorageKeys } from '../../localStorage/constants/storageKeys';
import { trackInteraction } from '../../usage-tracking/actions/trackInteraction';
import { EVENT_NAMES } from '../../usage-tracking/constants/eventNames';
import { getIsPortal53Prod } from '../../widget-data/operators/getIsPortal53Prod';
import { UPDATE_GLOBAL_COOKIE_OPT_OUT } from '../constants/ActionTypes';
import { OPT_OUT_NO, OPT_OUT_YES } from '../selectors/getGlobalCookieOptOut';
import { updateIsFirstVisitorSession } from './updateIsFirstVisitorSession';
export const updateGlobalCookieOptOut = createAction(UPDATE_GLOBAL_COOKIE_OPT_OUT, globalCookieOptOut => ({
  payload: {
    globalCookieOptOut
  }
}));
export const onGlobalCookieOptOut = globalCookieOptOut => dispatch => {
  dispatch(updateGlobalCookieOptOut(globalCookieOptOut));
  if (getIsPortal53Prod() && globalCookieOptOut === OPT_OUT_NO) {
    dispatch(updateIsFirstVisitorSession(false));
    dispatch(trackInteraction(EVENT_NAMES.PAGE_VIEW_FIFTY_THREE, {
      screen: 'widget',
      action: 'rendered widget'
    }));
  }
  if (globalCookieOptOut === OPT_OUT_YES) {
    dispatch(updateIsFirstVisitorSession(true));
    try {
      localStorage.removeItem(localStorageKeys.HUBLYTICS_EVENTS_53);
      localStorage.removeItem(localStorageKeys.HMPL);
    } catch (e) {
      return;
    }
  }
};