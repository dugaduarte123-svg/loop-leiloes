import { createSelector } from '@reduxjs/toolkit';
import { getWidgetUiState } from '../../selectors/getWidgetUiState';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
export const getShouldDisableAttachments = createSelector([getWidgetUiState, getLatestWidgetData], (widgetUiState, latestWidgetData) => widgetUiState.isAttachmentDisabled || !(latestWidgetData !== null && latestWidgetData !== void 0 && latestWidgetData.enableAttachments));