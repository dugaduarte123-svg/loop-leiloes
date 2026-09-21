import { createSelector } from '@reduxjs/toolkit';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
// @ts-ignore untyped file
import { displayBotQuickRepliesOutsideChat } from 'conversations-internal-schema/widget-data/operators/displayBotQuickRepliesOutsideChat';
import { getIsMobile } from '../getIsMobile';
export const getDisplayBotQuickRepliesOutsideChat = createSelector([getLatestWidgetData, getIsMobile], (widgetData, isMobile) => {
  const quickRepliesDisplay = displayBotQuickRepliesOutsideChat(widgetData);
  return ['DESKTOP_AND_MOBILE'].concat(isMobile ? ['MOBILE'] : ['DESKTOP']).includes(quickRepliesDisplay);
});