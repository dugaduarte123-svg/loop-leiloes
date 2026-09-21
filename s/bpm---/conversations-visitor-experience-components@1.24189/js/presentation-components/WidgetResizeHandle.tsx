import I18n from 'I18n';
import { useState } from 'react';
import styled, { css } from 'styled-components';
import { CALYPSO } from 'visitor-ui-component-library/constants/WidgetColors';
import { getFocusRingStyles } from 'visitor-ui-component-library/utils/getFocusRingStyles';
import { RIGHT_ALIGNED } from '../visitor-widget/constants/WidgetLocations';
import { useWidgetResizeContext } from '../contexts/WidgetResizeContext';
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const focusRingStyle = css(["", ""], getFocusRingStyles({
  ringColor: CALYPSO,
  outlineOffset: '-2px'
}));
const CornerHandle = styled.div.withConfig({
  displayName: "WidgetResizeHandle__CornerHandle"
})(["position:absolute;top:0;", " width:16px;height:16px;cursor:", ";touch-action:none;z-index:10;", ""], ({
  $widgetLocation
}) => $widgetLocation === RIGHT_ALIGNED ? 'left: 0;' : 'right: 0;', ({
  $widgetLocation
}) => $widgetLocation === RIGHT_ALIGNED ? 'nwse-resize' : 'nesw-resize', focusRingStyle);
const TopEdgeHandle = styled.div.withConfig({
  displayName: "WidgetResizeHandle__TopEdgeHandle"
})(["position:absolute;top:0;left:0;right:0;height:8px;cursor:ns-resize;touch-action:none;z-index:5;", ""], focusRingStyle);
const SideEdgeHandle = styled.div.withConfig({
  displayName: "WidgetResizeHandle__SideEdgeHandle"
})(["position:absolute;top:0;bottom:0;", " width:8px;cursor:ew-resize;touch-action:none;z-index:5;", ""], ({
  $widgetLocation
}) => $widgetLocation === RIGHT_ALIGNED ? 'left: 0;' : 'right: 0;', focusRingStyle);
const HOVERED_HANDLE = {
  TOP: 'top',
  SIDE: 'side',
  CORNER: 'corner'
};
const baseBorderStyle = {
  position: 'absolute',
  background: 'rgb(100, 100, 100)',
  pointerEvents: 'none',
  zIndex: 20,
  transition: 'opacity 0.15s ease-in-out'
};
export default function WidgetResizeHandle() {
  const {
    isResizeEnabled,
    onResizeHandlePointerDown,
    onTopEdgePointerDown,
    onSideEdgePointerDown,
    onResizeHandleKeyDown,
    onTopEdgeKeyDown,
    onSideEdgeKeyDown,
    onResizeKeyUp,
    currentWidgetSize,
    minWidgetSize,
    maxWidgetSize,
    widgetLocation
  } = useWidgetResizeContext();
  const [hoveredHandle, setHoveredHandle] = useState(null);
  const [focusedHandle, setFocusedHandle] = useState(null);
  if (!isResizeEnabled) return null;
  const isRightAligned = widgetLocation === RIGHT_ALIGNED;
  const activeHandle = hoveredHandle !== null && hoveredHandle !== void 0 ? hoveredHandle : focusedHandle;
  const showTop = activeHandle === HOVERED_HANDLE.TOP || activeHandle === HOVERED_HANDLE.CORNER;
  const showSide = activeHandle === HOVERED_HANDLE.SIDE || activeHandle === HOVERED_HANDLE.CORNER;
  const sideEdge = isRightAligned ? {
    left: 0
  } : {
    right: 0
  };
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx("div", {
      style: Object.assign({}, baseBorderStyle, {
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        opacity: showTop ? 0.5 : 0
      }),
      "aria-hidden": "true",
      "data-test-id": "widget-resize-top-border"
    }), /*#__PURE__*/_jsx("div", {
      style: Object.assign({}, baseBorderStyle, {
        top: 0,
        bottom: 0
      }, sideEdge, {
        width: 3,
        opacity: showSide ? 0.5 : 0
      }),
      "aria-hidden": "true",
      "data-test-id": "widget-resize-side-border"
    }), /*#__PURE__*/_jsx(TopEdgeHandle, {
      role: "separator",
      "aria-roledescription": "resize handle",
      "aria-orientation": "horizontal",
      "aria-label": I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.resizeWidgetHeight'),
      "aria-valuenow": currentWidgetSize.height,
      "aria-valuemin": minWidgetSize.height,
      "aria-valuemax": maxWidgetSize.height,
      tabIndex: 0,
      onPointerDown: onTopEdgePointerDown,
      onKeyDown: onTopEdgeKeyDown,
      onKeyUp: onResizeKeyUp,
      onMouseEnter: () => setHoveredHandle(HOVERED_HANDLE.TOP),
      onMouseLeave: () => setHoveredHandle(null),
      onFocus: () => setFocusedHandle(HOVERED_HANDLE.TOP),
      onBlur: () => setFocusedHandle(null),
      "data-test-id": "widget-top-edge-handle"
    }), /*#__PURE__*/_jsx(SideEdgeHandle, {
      $widgetLocation: widgetLocation,
      role: "separator",
      "aria-roledescription": "resize handle",
      "aria-orientation": "vertical",
      "aria-label": I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.resizeWidgetWidth'),
      "aria-valuenow": currentWidgetSize.width,
      "aria-valuemin": minWidgetSize.width,
      "aria-valuemax": maxWidgetSize.width,
      tabIndex: 0,
      onPointerDown: onSideEdgePointerDown,
      onKeyDown: onSideEdgeKeyDown,
      onKeyUp: onResizeKeyUp,
      onMouseEnter: () => setHoveredHandle(HOVERED_HANDLE.SIDE),
      onMouseLeave: () => setHoveredHandle(null),
      onFocus: () => setFocusedHandle(HOVERED_HANDLE.SIDE),
      onBlur: () => setFocusedHandle(null),
      "data-test-id": "widget-side-edge-handle"
    }), /*#__PURE__*/_jsx(CornerHandle, {
      $widgetLocation: widgetLocation,
      role: "button",
      "aria-roledescription": "resize handle",
      "aria-label": I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.resizeWidget'),
      tabIndex: 0,
      onPointerDown: onResizeHandlePointerDown,
      onKeyDown: onResizeHandleKeyDown,
      onKeyUp: onResizeKeyUp,
      onMouseEnter: () => setHoveredHandle(HOVERED_HANDLE.CORNER),
      onMouseLeave: () => setHoveredHandle(null),
      onFocus: () => setFocusedHandle(HOVERED_HANDLE.CORNER),
      onBlur: () => setFocusedHandle(null),
      "data-test-id": "widget-resize-handle"
    })]
  });
}
WidgetResizeHandle.displayName = 'WidgetResizeHandle';