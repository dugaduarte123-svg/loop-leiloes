import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import I18n from 'I18n';
import { DetachedWindowContext, DETACHED_WINDOW_QUERY_PARAM } from 'conversations-visitor-experience-components/contexts/DetachedWindowContext';
import { useVisitorDetachWindowHostIntegration } from '../detach-window/useVisitorDetachHostIntegration';
import { getIsUngatedForDetachWidget } from '../widget-data/selectors/widgetDataSelectors';

// Design note: the detached window is a separate full app instance with its own
// Redux store. Both windows receive the same push messages via the WidgetShell
// iframeMessage fan-out, so incoming data stays in sync. State changes made in
// one window (e.g. sending a message, navigating threads) are not reflected in
// the other until onHostSurfaceRestored runs on re-attach. This is acceptable
// because a visitor operates in one window at a time. If that assumption changes,
// a shared store or continuous sync mechanism would be needed.
import { jsx as _jsx } from "react/jsx-runtime";
const DEFAULT_DETACHED_WIDGET_SIZE = {
  width: 420,
  height: 760
};
const DETACHED_WINDOW_CHANNEL = 'hs-detached-window-channel';
const DETACHED_WINDOW_REATTACH = 'reattach';
const DETACHED_WINDOW_CLOSED = 'closed';
const DETACHED_WINDOW_DEFAULT_POPUP_FEATURES = `width=${DEFAULT_DETACHED_WIDGET_SIZE.width},height=${DEFAULT_DETACHED_WIDGET_SIZE.height},resizable,scrollbars=yes`;
const DETACHED_WINDOW_POPUP_NAME = 'hs-detached-widget';
const getClosedError = () => I18n.text('conversations-visitor-ui.detachedWindow.closedError');
const getPopupBlockedError = () => I18n.text('conversations-visitor-ui.detachedWindow.popupBlockedError');
const BEFOREUNLOAD_MESSAGE_GRACE_MS = 1500;
const CLOSED_POLL_INTERVAL_MS = 2000;
const getDetachedWindowUrl = () => {
  const url = new URL(window.location.href);
  url.searchParams.set(DETACHED_WINDOW_QUERY_PARAM, 'true');
  return url.toString();
};
const postDetachedWindowMessageToOpener = (type, sync) => {
  if (!window.opener) {
    return;
  }
  window.opener.postMessage(Object.assign({
    channel: DETACHED_WINDOW_CHANNEL,
    type
  }, sync ? {
    sync
  } : {}), window.location.origin);
};
export const DetachedWindowProvider = ({
  children
}) => {
  const hostIntegration = useVisitorDetachWindowHostIntegration();
  const isDetachEnabled = useSelector(getIsUngatedForDetachWidget);
  const hostIntegrationRef = useRef(hostIntegration);
  hostIntegrationRef.current = hostIntegration;
  const isDetachedWindow = useMemo(() => new URLSearchParams(window.location.search).get(DETACHED_WINDOW_QUERY_PARAM) === 'true', []);
  const [detachedWindow, setDetachedWindow] = useState(null);
  const [detachedWindowError, setDetachedWindowError] = useState('');
  const isDetached = isDetachedWindow || detachedWindow !== null;
  useEffect(() => {
    if (!detachedWindow) {
      return;
    }
    let intervalId;
    const startFallbackClosedPoll = () => {
      intervalId = window.setInterval(() => {
        var _hostIntegrationRef$c;
        if (!detachedWindow.closed) {
          return;
        }
        setDetachedWindow(null);
        (_hostIntegrationRef$c = hostIntegrationRef.current) === null || _hostIntegrationRef$c === void 0 || _hostIntegrationRef$c.onHostSurfaceRestored();
      }, CLOSED_POLL_INTERVAL_MS);
    };
    const timeoutId = window.setTimeout(startFallbackClosedPoll, BEFOREUNLOAD_MESSAGE_GRACE_MS);
    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [detachedWindow]);
  useEffect(() => () => {
    if (!detachedWindow || detachedWindow.closed) {
      return;
    }
    detachedWindow.close();
  }, [detachedWindow]);
  useEffect(() => {
    if (isDetachedWindow) {
      const handleBeforeUnload = () => {
        var _hostIntegrationRef$c2;
        const sync = (_hostIntegrationRef$c2 = hostIntegrationRef.current) === null || _hostIntegrationRef$c2 === void 0 ? void 0 : _hostIntegrationRef$c2.getReattachSyncPayload();
        postDetachedWindowMessageToOpener(DETACHED_WINDOW_CLOSED, sync);
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
    const handleMessage = event => {
      if (event.origin !== window.location.origin) {
        return;
      }
      if (!event.data || event.data.channel !== DETACHED_WINDOW_CHANNEL) {
        return;
      }
      if (event.data.type === DETACHED_WINDOW_REATTACH || event.data.type === DETACHED_WINDOW_CLOSED) {
        var _hostIntegrationRef$c3;
        setDetachedWindow(null);
        (_hostIntegrationRef$c3 = hostIntegrationRef.current) === null || _hostIntegrationRef$c3 === void 0 || _hostIntegrationRef$c3.onHostSurfaceRestored(event.data.sync);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isDetachedWindow]);
  const focusDetachedWindow = useCallback(() => {
    if (isDetachedWindow) {
      return;
    }
    if (!detachedWindow || detachedWindow.closed) {
      setDetachedWindow(null);
      setDetachedWindowError(getClosedError());
      return;
    }
    detachedWindow.focus();
  }, [isDetachedWindow, detachedWindow]);
  const closeDetachedWindow = useCallback(() => {
    if (isDetachedWindow) {
      var _hostIntegrationRef$c4;
      const sync = (_hostIntegrationRef$c4 = hostIntegrationRef.current) === null || _hostIntegrationRef$c4 === void 0 ? void 0 : _hostIntegrationRef$c4.getReattachSyncPayload();
      postDetachedWindowMessageToOpener(DETACHED_WINDOW_REATTACH, sync);
      window.close();
      return;
    }
    if (detachedWindow && !detachedWindow.closed) {
      detachedWindow.close();
    }
    setDetachedWindow(null);
  }, [isDetachedWindow, detachedWindow]);
  const openDetachedWindow = useCallback(() => {
    var _hostIntegrationRef$c5, _hostIntegrationRef$c6, _hostIntegrationRef$c7, _hostIntegrationRef$c8, _hostIntegrationRef$c9;
    if (isDetachedWindow || !isDetachEnabled) {
      return;
    }
    if (detachedWindow && !detachedWindow.closed) {
      detachedWindow.focus();
      setDetachedWindowError('');
      return;
    }
    (_hostIntegrationRef$c5 = hostIntegrationRef.current) === null || _hostIntegrationRef$c5 === void 0 || _hostIntegrationRef$c5.persistStateBeforeDetach();
    const href = (_hostIntegrationRef$c6 = hostIntegrationRef.current) !== null && _hostIntegrationRef$c6 !== void 0 && _hostIntegrationRef$c6.prepareDetachedWindowUrl ? hostIntegrationRef.current.prepareDetachedWindowUrl(window.location.href) : getDetachedWindowUrl();
    const popupFeatures = (_hostIntegrationRef$c7 = (_hostIntegrationRef$c8 = hostIntegrationRef.current) === null || _hostIntegrationRef$c8 === void 0 || (_hostIntegrationRef$c9 = _hostIntegrationRef$c8.getPopupFeatures) === null || _hostIntegrationRef$c9 === void 0 ? void 0 : _hostIntegrationRef$c9.call(_hostIntegrationRef$c8)) !== null && _hostIntegrationRef$c7 !== void 0 ? _hostIntegrationRef$c7 : DETACHED_WINDOW_DEFAULT_POPUP_FEATURES;
    const popupWindow = window.open(href, DETACHED_WINDOW_POPUP_NAME, popupFeatures);
    if (!popupWindow) {
      setDetachedWindowError(getPopupBlockedError());
      return;
    }
    setDetachedWindow(popupWindow);
    setDetachedWindowError('');
    popupWindow.focus();
  }, [isDetachedWindow, isDetachEnabled, detachedWindow]);
  const toggleDetachedWindow = useCallback(() => {
    if (isDetached) {
      closeDetachedWindow();
      return;
    }
    openDetachedWindow();
  }, [isDetached, closeDetachedWindow, openDetachedWindow]);
  const clearDetachedWindowError = useCallback(() => {
    setDetachedWindowError('');
  }, []);
  return /*#__PURE__*/_jsx(DetachedWindowContext.Provider, {
    value: {
      isDetachedWindow,
      isDetached,
      detachedWindowError,
      toggleDetachedWindow,
      closeDetachedWindow,
      focusDetachedWindow,
      clearDetachedWindowError,
      isDetachEnabled
    },
    children: children
  });
};
DetachedWindowProvider.displayName = 'DetachedWindowProvider';