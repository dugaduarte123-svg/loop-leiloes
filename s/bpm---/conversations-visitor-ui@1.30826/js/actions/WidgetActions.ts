import { createAction } from '@reduxjs/toolkit';
import { getIsOpen } from '../selectors/getIsOpen';
import * as ActionTypes from '../constants/VisitorActionTypes';
import { trackInteraction } from '../usage-tracking/actions/trackInteraction';
import { handleOpenChange } from '../post-message/handleOpenChange';
import { postWidgetClosedEvent } from './postWidgetClosedEvent';
import { EVENT_NAMES } from '../usage-tracking/constants/eventNames';
import { getKnowledgeBaseEnabled } from '../selectors/widgetDataSelectors/getKnowledgeBaseEnabled';
import { getCurrentView } from '../current-view/selectors/getCurrentView';
import { THREAD_LIST } from 'conversations-visitor-experience-components/visitor-widget/constants/views';
import { getIsAIChatbot } from '../selectors/widgetDataSelectors/getIsAIChatbot';
export const toggleOpenAction = createAction(ActionTypes.TOGGLE_OPEN, ({
  isOpened,
  isUser
}) => ({
  payload: {
    isOpened,
    isUser: isUser || false
  }
}));
export function toggleOpen({
  isOpened,
  isUser,
  openedFrom
}) {
  return (dispatch, getState) => {
    const isAIChatbot = getIsAIChatbot(getState());
    if (isOpened !== getIsOpen(getState())) {
      const openActionMessage = isUser ? 'user open widget' : 'system open widget';
      dispatch(trackInteraction(EVENT_NAMES.WIDGET_INTERACTION, {
        action: isOpened ? openActionMessage : 'close widget',
        openedFrom,
        isAIChatbot
      }));
      dispatch(toggleOpenAction({
        isOpened,
        isUser
      }));
      handleOpenChange(isOpened, isUser);
      if (!isOpened) {
        postWidgetClosedEvent();
      }
      let trackedOnce = false;
      if (!trackedOnce && getKnowledgeBaseEnabled(getState()) && getCurrentView(getState()) === THREAD_LIST) {
        trackedOnce = true;
        dispatch(trackInteraction(EVENT_NAMES.WIDGET_INTERACTION, {
          action: 'view thread list'
        }));
      }
    }
  };
}
export const clickedViralLink = createAction(ActionTypes.CLICK_VIRAL_LINK);