import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RIGHT_ALIGNED } from 'conversations-internal-schema/widget-location/constants/WidgetLocations';
import { useDispatch, useSelector } from 'react-redux';
import { getUsePillLauncher } from '../widget-data/selectors/widgetDataSelectors';
import { useBrowserWindowContext } from '../components/BrowserWindowContext';
import { handleIframeResize } from '../post-message/handleIframeResize';
import { handleDragHandlePositionChange } from '../post-message/handleDragHandlePositionChange';
import { postMessageToParent } from '../post-message/postMessageToParent';
import { clampWidgetSize, DOCKED_WIDGET_WIDTH } from '../widget-size/widgetSizePreference';
import { STORE_WIDGET_SIZE_PREFERENCE } from '../constants/PostMessageTypes';
import { trackInteraction } from '../usage-tracking/actions/trackInteraction';
import { EVENT_NAMES } from '../usage-tracking/constants/eventNames';
import { setPreferredWidgetSize } from '../widget-size/widgetSizeSlice';
import { usePreferredWidgetSize } from '../widget-size/widgetSizeSelectors';
import { useWidgetSizeSync } from './useWidgetSizeSync';
import { createResizeDragHandler } from './createResizeDragHandler';
import { useWidgetResizeAccessibility } from './useWidgetResizeAccessibility';
const computeAlignedWidth = ({
  startWidth,
  deltaX,
  isRightAligned
}) => isRightAligned ? startWidth - deltaX : startWidth + deltaX;
export const useWidgetResize = ({
  isResizeEnabled,
  widgetLocation,
  defaultWidgetSize
}) => {
  const {
    browserWindowHeight,
    browserWindowWidth
  } = useBrowserWindowContext();
  const usePillLauncher = useSelector(getUsePillLauncher);
  const dispatch = useDispatch();
  const preferredSize = usePreferredWidgetSize();
  const wrapperRef = useRef(null);
  const isDraggingRef = useRef(false);
  const [isResizing, setIsResizing] = useState(false);
  const isExpanded = preferredSize !== null && (preferredSize.width > defaultWidgetSize.width || preferredSize.height > defaultWidgetSize.height);
  useWidgetSizeSync({
    isResizeEnabled,
    wrapperRef,
    isDraggingRef,
    browserWindowWidth,
    browserWindowHeight,
    usePillLauncher,
    defaultWidgetSize
  });
  useEffect(() => {
    if (!isResizeEnabled || !isResizing) return;
    handleDragHandlePositionChange({
      dragHandleState: 'hidden'
    });
    return () => {
      handleDragHandlePositionChange({
        dragHandleState: 'widget-open'
      });
    };
  }, [isResizing, isResizeEnabled]);
  const onSizeCommitted = useCallback(finalSize => {
    dispatch(setPreferredWidgetSize(finalSize));
    postMessageToParent(STORE_WIDGET_SIZE_PREFERENCE, finalSize);
    if (wrapperRef.current) {
      handleIframeResize({
        width: wrapperRef.current.offsetWidth,
        height: wrapperRef.current.offsetHeight
      });
    }
  }, [dispatch]);
  const onSizeTracked = useCallback(finalSize => {
    dispatch(trackInteraction(EVENT_NAMES.RESIZED_WIDGET, {
      resizeType: 'custom',
      widgetWidth: Math.round(finalSize.width),
      widgetHeight: Math.round(finalSize.height)
    }));
  }, [dispatch]);
  const baseHandlerConfig = useMemo(() => ({
    wrapperRef,
    isDraggingRef,
    setIsResizing,
    defaultWidgetSize,
    browserWindowWidth,
    browserWindowHeight,
    onSizeCommitted,
    onSizeTracked
  }), [defaultWidgetSize, browserWindowWidth, browserWindowHeight, onSizeCommitted, onSizeTracked]);
  const onResizeHandlePointerDown = useCallback(event => createResizeDragHandler(Object.assign({}, baseHandlerConfig, {
    computeNewSize: ({
      startWidth,
      startHeight,
      startX,
      startY
    }, screenX, screenY) => clampWidgetSize({
      width: computeAlignedWidth({
        startWidth,
        deltaX: screenX - startX,
        isRightAligned: widgetLocation === RIGHT_ALIGNED
      }),
      height: startHeight - (screenY - startY),
      browserWindowWidth: baseHandlerConfig.browserWindowWidth,
      browserWindowHeight: baseHandlerConfig.browserWindowHeight,
      usePillLauncher,
      minWidth: defaultWidgetSize.width,
      minHeight: defaultWidgetSize.height
    }),
    applyCSSUpdate: (el, {
      width,
      height
    }) => {
      el.style.setProperty('--widget-width', `${width}px`);
      el.style.setProperty('--widget-height', `${height}px`);
    },
    hasChanged: ({
      width,
      height
    }, {
      startWidth,
      startHeight
    }) => width !== startWidth || height !== startHeight
  }))(event), [baseHandlerConfig, widgetLocation, usePillLauncher, defaultWidgetSize.width, defaultWidgetSize.height]);
  const onTopEdgePointerDown = useCallback(event => createResizeDragHandler(Object.assign({}, baseHandlerConfig, {
    computeNewSize: ({
      startWidth,
      startHeight,
      startY
    }, _screenX, screenY) => clampWidgetSize({
      width: startWidth,
      height: startHeight - (screenY - startY),
      browserWindowWidth: baseHandlerConfig.browserWindowWidth,
      browserWindowHeight: baseHandlerConfig.browserWindowHeight,
      usePillLauncher,
      minHeight: defaultWidgetSize.height
    }),
    applyCSSUpdate: (el, {
      height
    }) => {
      el.style.setProperty('--widget-height', `${height}px`);
    },
    hasChanged: ({
      height
    }, {
      startHeight
    }) => height !== startHeight
  }))(event), [baseHandlerConfig, usePillLauncher, defaultWidgetSize.height]);
  const onSideEdgePointerDown = useCallback(event => createResizeDragHandler(Object.assign({}, baseHandlerConfig, {
    computeNewSize: ({
      startWidth,
      startHeight,
      startX
    }, screenX) => clampWidgetSize({
      width: computeAlignedWidth({
        startWidth,
        deltaX: screenX - startX,
        isRightAligned: widgetLocation === RIGHT_ALIGNED
      }),
      height: startHeight,
      browserWindowWidth: baseHandlerConfig.browserWindowWidth,
      browserWindowHeight: baseHandlerConfig.browserWindowHeight,
      usePillLauncher,
      minWidth: defaultWidgetSize.width
    }),
    applyCSSUpdate: (el, {
      width
    }) => {
      el.style.setProperty('--widget-width', `${width}px`);
    },
    hasChanged: ({
      width
    }, {
      startWidth
    }) => width !== startWidth
  }))(event), [baseHandlerConfig, widgetLocation, usePillLauncher, defaultWidgetSize.width]);
  const maxWidgetSize = useMemo(() => clampWidgetSize({
    width: Number.MAX_SAFE_INTEGER,
    height: Number.MAX_SAFE_INTEGER,
    browserWindowWidth,
    browserWindowHeight,
    usePillLauncher
  }), [browserWindowWidth, browserWindowHeight, usePillLauncher]);
  const {
    onResizeHandleKeyDown,
    onTopEdgeKeyDown,
    onSideEdgeKeyDown,
    onResizeKeyUp,
    currentWidgetSize
  } = useWidgetResizeAccessibility({
    wrapperRef,
    onSizeCommitted,
    onSizeTracked,
    preferredSize,
    defaultWidgetSize,
    widgetLocation,
    browserWindowWidth,
    browserWindowHeight,
    usePillLauncher
  });
  const onToggleExpand = useCallback(() => {
    const resizeType = isExpanded ? 'classic' : 'docked';
    const newSize = isExpanded ? defaultWidgetSize : clampWidgetSize({
      width: DOCKED_WIDGET_WIDTH,
      height: Number.MAX_SAFE_INTEGER,
      browserWindowWidth,
      browserWindowHeight,
      usePillLauncher
    });
    dispatch(setPreferredWidgetSize(newSize));
    postMessageToParent(STORE_WIDGET_SIZE_PREFERENCE, newSize);
    dispatch(trackInteraction(EVENT_NAMES.RESIZED_WIDGET, {
      resizeType,
      widgetWidth: newSize.width,
      widgetHeight: newSize.height
    }));
  }, [isExpanded, browserWindowWidth, browserWindowHeight, usePillLauncher, defaultWidgetSize, dispatch]);
  const resizeContextValue = useMemo(() => ({
    isResizeEnabled,
    onResizeHandlePointerDown,
    onTopEdgePointerDown,
    onSideEdgePointerDown,
    onResizeHandleKeyDown,
    onTopEdgeKeyDown,
    onSideEdgeKeyDown,
    onResizeKeyUp,
    currentWidgetSize,
    minWidgetSize: defaultWidgetSize,
    maxWidgetSize,
    widgetLocation,
    isResizing,
    isExpanded,
    onToggleExpand
  }), [isResizeEnabled, onResizeHandlePointerDown, onTopEdgePointerDown, onSideEdgePointerDown, onResizeHandleKeyDown, onTopEdgeKeyDown, onSideEdgeKeyDown, onResizeKeyUp, currentWidgetSize, maxWidgetSize, widgetLocation, isResizing, isExpanded, onToggleExpand, defaultWidgetSize]);
  return {
    wrapperRef,
    isDraggingRef,
    resizeContextValue
  };
};