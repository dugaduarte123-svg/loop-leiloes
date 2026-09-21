import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["children", "inline", "mobile", "isOpen", "widgetLocation"];
import styled, { css } from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import { LEFT_ALIGNED, RIGHT_ALIGNED } from 'conversations-internal-schema/widget-location/constants/WidgetLocations';
import { WidgetResizeContext } from 'conversations-visitor-experience-components/contexts/WidgetResizeContext';
import { useSelector } from 'react-redux';
import { useBrowserWindowContext } from './BrowserWindowContext';
import { useMeasure } from '../hooks/useMeasure';
import { useWidgetResize } from '../hooks/useWidgetResize';
import { getIsUngatedForInAppHelp, getUseSpotlightLauncher } from '../widget-data/selectors/widgetDataSelectors';
import { useWidgetSize } from '../widget-size/widgetSizeSelectors';
import { useDetachedWindow } from 'conversations-visitor-experience-components/contexts/DetachedWindowContext';
import { spotlightTheme } from 'conversations-visitor-experience-components/visitor-widget/spotlight/theme';
import { useSpotlightGlowColor } from '../hooks/useSpotlightGlowColor';
import { jsx as _jsx } from "react/jsx-runtime";
const widgetLocationStyles = {
  [RIGHT_ALIGNED]: css(["right:0;align-items:flex-end;"]),
  [LEFT_ALIGNED]: css(["left:0;align-items:flex-start;"])
};
const inlineCss = css(["padding:0;inset:0;"]);
// Spotlight never runs on mobile (see getUseSpotlightLauncher), so no mobile variant is needed here.
const getWrapperPadding = ({
  mobile,
  isDetachedWindow,
  $isSpotlight,
  $showGlow
}) => {
  if (isDetachedWindow) return '0';
  if ($isSpotlight && $showGlow) return spotlightTheme.spacing.xxxl;
  return mobile ? '8px' : '16px';
};
const Wrapper = styled.div.withConfig({
  displayName: "WidgetWrapper__Wrapper"
})(["position:absolute;bottom:0;display:flex;padding:", ";gap:", ";flex-direction:column;justify-content:flex-end;min-width:", ";", ";", ""], getWrapperPadding, ({
  isDetachedWindow
}) => isDetachedWindow ? '0' : '12px', ({
  isDetachedWindow
}) => isDetachedWindow ? '100%' : 'auto', ({
  widgetLocation,
  inline
}) => inline ? inlineCss : widgetLocationStyles[widgetLocation], ({
  $isSpotlight
}) => $isSpotlight && `
    right: auto;
    left: 50%;
    transform: translateX(-50%);
    align-items: center;
  `);
export default function WidgetWrapper(_ref) {
  let {
      children,
      inline,
      mobile,
      isOpen,
      widgetLocation
    } = _ref,
    props = _objectWithoutPropertiesLoose(_ref, _excluded);
  const {
    isDetachedWindow
  } = useDetachedWindow();
  const {
    browserWindowHeight,
    browserWindowWidth
  } = useBrowserWindowContext();
  const defaultWidgetSize = useWidgetSize();
  const isUngatedForInAppHelp = useSelector(getIsUngatedForInAppHelp);
  const isSpotlight = useSelector(getUseSpotlightLauncher);
  const glowColor = useSpotlightGlowColor();
  const isResizeEnabled = isUngatedForInAppHelp && !inline && !mobile && !isSpotlight;
  const {
    wrapperRef,
    isDraggingRef,
    resizeContextValue
  } = useWidgetResize({
    isResizeEnabled,
    widgetLocation,
    defaultWidgetSize
  });
  const measureRef = useMeasure({
    isDraggingRef
  });
  const combinedRef = useCallback(node => {
    wrapperRef.current = node;
    measureRef(node);
  }, [wrapperRef, measureRef]);
  const [style, setStyle] = useState(() => {
    return mobile && isOpen ? {
      height: browserWindowHeight,
      width: browserWindowWidth
    } : {};
  });
  useEffect(() => {
    if (mobile) {
      const timeoutId = setTimeout(() => {
        setStyle(isOpen ? {
          height: browserWindowHeight,
          width: browserWindowWidth
        } : {});
      }, isOpen ? 0 : 500);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, mobile, browserWindowHeight, browserWindowWidth]);
  return /*#__PURE__*/_jsx(WidgetResizeContext.Provider, {
    value: resizeContextValue,
    children: /*#__PURE__*/_jsx(Wrapper, Object.assign({
      style: style,
      ref: combinedRef,
      inline: inline,
      widgetLocation: widgetLocation
    }, props, {
      mobile: mobile,
      isDetachedWindow: isDetachedWindow,
      $isSpotlight: isSpotlight,
      $showGlow: Boolean(glowColor),
      "data-test-id": "widget-wrapper",
      children: children
    }))
  });
}
WidgetWrapper.displayName = 'WidgetWrapper';