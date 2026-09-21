import { createSelector } from '@reduxjs/toolkit';
import { getWidgetUiState } from './getWidgetUiState';
export const getShouldHideWelcomeMessage = createSelector([getWidgetUiState], widgetUiState => widgetUiState.hideWelcomeMessage);