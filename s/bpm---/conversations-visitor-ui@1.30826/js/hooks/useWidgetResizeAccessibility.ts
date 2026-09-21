import { useCallback, useRef } from 'react';
import { RIGHT_ALIGNED } from 'conversations-internal-schema/widget-location/constants/WidgetLocations';
import { clampWidgetSize } from '../widget-size/widgetSizePreference';
const KEYBOARD_RESIZE_STEP = 10;
const ARROW_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);
const computeKeyboardDeltas = (key, isRightAligned, controlsHeight, controlsWidth) => {
  let deltaWidth = 0;
  let deltaHeight = 0;
  let handled = false;
  if (controlsHeight) {
    if (key === 'ArrowUp') {
      deltaHeight = KEYBOARD_RESIZE_STEP;
      handled = true;
    } else if (key === 'ArrowDown') {
      deltaHeight = -KEYBOARD_RESIZE_STEP;
      handled = true;
    }
  }
  if (controlsWidth) {
    const widthStep = isRightAligned ? KEYBOARD_RESIZE_STEP : -KEYBOARD_RESIZE_STEP;
    if (key === 'ArrowLeft') {
      deltaWidth = widthStep;
      handled = true;
    } else if (key === 'ArrowRight') {
      deltaWidth = -widthStep;
      handled = true;
    }
  }
  return handled ? {
    deltaWidth,
    deltaHeight
  } : null;
};
export const useWidgetResizeAccessibility = ({
  wrapperRef,
  onSizeCommitted,
  onSizeTracked,
  preferredSize,
  defaultWidgetSize,
  widgetLocation,
  browserWindowWidth,
  browserWindowHeight,
  usePillLauncher
}) => {
  const currentWidgetSize = preferredSize !== null && preferredSize !== void 0 ? preferredSize : defaultWidgetSize;
  const pendingKeyboardSizeRef = useRef(null);
  const applyKeyboardResize = useCallback((key, controlsHeight, controlsWidth) => {
    var _ref, _pendingKeyboardSizeR;
    const deltas = computeKeyboardDeltas(key, widgetLocation === RIGHT_ALIGNED, controlsHeight, controlsWidth);
    if (!deltas) return false;
    const base = (_ref = (_pendingKeyboardSizeR = pendingKeyboardSizeRef.current) !== null && _pendingKeyboardSizeR !== void 0 ? _pendingKeyboardSizeR : preferredSize) !== null && _ref !== void 0 ? _ref : defaultWidgetSize;
    const newSize = clampWidgetSize({
      width: base.width + deltas.deltaWidth,
      height: base.height + deltas.deltaHeight,
      browserWindowWidth,
      browserWindowHeight,
      usePillLauncher,
      minWidth: defaultWidgetSize.width,
      minHeight: defaultWidgetSize.height
    });
    pendingKeyboardSizeRef.current = newSize;
    if (wrapperRef.current) {
      if (controlsWidth) {
        wrapperRef.current.style.setProperty('--widget-width', `${newSize.width}px`);
      }
      if (controlsHeight) {
        wrapperRef.current.style.setProperty('--widget-height', `${newSize.height}px`);
      }
    }
    return true;
  }, [widgetLocation, preferredSize, defaultWidgetSize, browserWindowWidth, browserWindowHeight, usePillLauncher, wrapperRef]);
  const onResizeHandleKeyDown = useCallback(event => {
    if (applyKeyboardResize(event.key, true, true)) event.preventDefault();
  }, [applyKeyboardResize]);
  const onTopEdgeKeyDown = useCallback(event => {
    if (applyKeyboardResize(event.key, true, false)) event.preventDefault();
  }, [applyKeyboardResize]);
  const onSideEdgeKeyDown = useCallback(event => {
    if (applyKeyboardResize(event.key, false, true)) event.preventDefault();
  }, [applyKeyboardResize]);
  const onResizeKeyUp = useCallback(event => {
    if (!ARROW_KEYS.has(event.key)) return;
    if (pendingKeyboardSizeRef.current !== null) {
      const size = pendingKeyboardSizeRef.current;
      pendingKeyboardSizeRef.current = null;
      onSizeCommitted(size);
      onSizeTracked(size);
    }
  }, [onSizeCommitted, onSizeTracked]);
  return {
    onResizeHandleKeyDown,
    onTopEdgeKeyDown,
    onSideEdgeKeyDown,
    onResizeKeyUp,
    currentWidgetSize
  };
};