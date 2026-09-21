import { createContext, useContext } from 'react';
import { RIGHT_ALIGNED } from '../visitor-widget/constants/WidgetLocations';
const defaultWidgetResizeContextValue = {
  isResizeEnabled: false,
  onResizeHandlePointerDown: () => {},
  onTopEdgePointerDown: () => {},
  onSideEdgePointerDown: () => {},
  onResizeHandleKeyDown: () => {},
  onTopEdgeKeyDown: () => {},
  onSideEdgeKeyDown: () => {},
  onResizeKeyUp: () => {},
  currentWidgetSize: {
    width: 0,
    height: 0
  },
  minWidgetSize: {
    width: 0,
    height: 0
  },
  maxWidgetSize: {
    width: 0,
    height: 0
  },
  widgetLocation: RIGHT_ALIGNED,
  isResizing: false,
  isExpanded: false,
  onToggleExpand: () => {}
};
export const WidgetResizeContext = /*#__PURE__*/createContext(defaultWidgetResizeContextValue);
export const useWidgetResizeContext = () => useContext(WidgetResizeContext);