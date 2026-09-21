import { createSelector } from '@reduxjs/toolkit';
import { getWidgetUiState } from '../../selectors/getWidgetUiState';
export const getWidgetStartOpen = createSelector([getWidgetUiState], widgetUiState => widgetUiState.startOpen);