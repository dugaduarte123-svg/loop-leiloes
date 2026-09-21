import { createSelector } from '@reduxjs/toolkit';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
import { gdprCookieConsentPromptMessage } from 'conversations-internal-schema/widget-data/operators/gdprCookieConsentPromptMessage';
export const getCookieConsentPromptMessage = createSelector([getLatestWidgetData], widgetData => gdprCookieConsentPromptMessage(widgetData) || undefined);