import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { DOCKED_WIDGET_WIDTH } from './widgetSizePreference';
export const getWidgetSize = state => {
  return state.widgetSize.size;
};
export const useWidgetSize = () => {
  return useSelector(getWidgetSize);
};
export const getPreferredWidgetSize = state => {
  return state.widgetSize.preferredSize;
};
export const usePreferredWidgetSize = () => {
  return useSelector(getPreferredWidgetSize);
};
const getResizeType = (preferredSize, defaultSize) => {
  if (preferredSize.width === defaultSize.width && preferredSize.height === defaultSize.height) {
    return 'classic';
  }
  if (preferredSize.width === DOCKED_WIDGET_WIDTH) {
    return 'docked';
  }
  return 'custom';
};
export const getWidgetSizeEventProps = createSelector([getWidgetSize, getPreferredWidgetSize], (defaultSize, preferred) => {
  const preferredSize = preferred !== null && preferred !== void 0 ? preferred : defaultSize;
  const resizeType = getResizeType(preferredSize, defaultSize);
  return {
    widgetWidth: Math.round(preferredSize.width),
    widgetHeight: Math.round(preferredSize.height),
    resizeType
  };
});