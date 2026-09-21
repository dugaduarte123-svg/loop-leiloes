import { useEffect, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clampWidgetSize } from '../widget-size/widgetSizePreference';
import { WIDGET_SIZE_PREFERENCE } from '../constants/PostMessageTypes';
import { setPreferredWidgetSize } from '../widget-size/widgetSizeSlice';
import { usePreferredWidgetSize } from '../widget-size/widgetSizeSelectors';
export const useWidgetSizeSync = ({
  isResizeEnabled,
  wrapperRef,
  isDraggingRef,
  browserWindowWidth,
  browserWindowHeight,
  usePillLauncher,
  defaultWidgetSize
}) => {
  const dispatch = useDispatch();
  const preferredSize = usePreferredWidgetSize();
  useEffect(() => {
    if (!isResizeEnabled) return;
    const handleMessage = event => {
      var _parsed, _parsed$data;
      let parsed = null;
      try {
        parsed = JSON.parse(event.data);
      } catch (_unused) {
        return;
      }
      if (((_parsed = parsed) === null || _parsed === void 0 ? void 0 : _parsed.type) !== WIDGET_SIZE_PREFERENCE) return;
      const {
        width,
        height
      } = (_parsed$data = parsed.data) !== null && _parsed$data !== void 0 ? _parsed$data : {};
      if (Number.isFinite(width) && Number.isFinite(height)) {
        dispatch(setPreferredWidgetSize({
          width: width,
          height: height
        }));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isResizeEnabled, dispatch]);
  useLayoutEffect(() => {
    if (!isResizeEnabled || isDraggingRef.current || !wrapperRef.current) return;
    if (preferredSize) {
      const clamped = clampWidgetSize(Object.assign({}, preferredSize, {
        browserWindowWidth,
        browserWindowHeight,
        usePillLauncher,
        minWidth: defaultWidgetSize.width,
        minHeight: defaultWidgetSize.height
      }));
      wrapperRef.current.style.setProperty('--widget-width', `${clamped.width}px`);
      wrapperRef.current.style.setProperty('--widget-height', `${clamped.height}px`);
    } else {
      wrapperRef.current.style.removeProperty('--widget-width');
      wrapperRef.current.style.removeProperty('--widget-height');
    }
  }, [isResizeEnabled, preferredSize, browserWindowWidth, browserWindowHeight, usePillLauncher, isDraggingRef, wrapperRef, defaultWidgetSize.width, defaultWidgetSize.height]);
};