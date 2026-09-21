import { createAction } from '@reduxjs/toolkit';
import { TRACK_USER_INTERACTION } from '../constants/VisitorActionTypes';
import { getUserInteractedWithWidget } from '../selectors/getUserInteractedWithWidget';
import { postUserInteractedWithWidgetEvent } from './postUserInteractedWithWidgetEvent';
import { setGlobalDimension } from '../usage-tracking/utils/trackMetric';
export function trackUserInteraction() {
  return (dispatch, getState) => {
    if (!getUserInteractedWithWidget(getState())) {
      setGlobalDimension('interactedWithWidget', 'true');
      postUserInteractedWithWidgetEvent();
    }
    dispatch(createAction(TRACK_USER_INTERACTION)());
  };
}