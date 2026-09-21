import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessageEditorTextAction } from '../actions/messageEditorActions';
import { getHasMessagesCookieBeenSaved } from '../gdpr/selectors/getHasMessagesCookieBeenSaved';
import { getMessageEditorText } from '../message-editor/selectors/getMessageEditorText';
import { isDetachedWindow } from '../query-params/isDetachedWindow';
import { getSessionId } from '../selectors/widgetDataSelectors/getSessionId';
import { getSelectedThreadId } from '../selected-thread/selectors/getSelectedThreadId';
import { STUBBED_THREAD_ID } from '../threads/constants/stubbedThreadId';
import { syncVisitorStateAfterDetachedSurfaceCloses } from '../threads/actions/syncVisitorStateAfterDetachedSurfaceCloses';
import { getWidgetShellUUID } from '../query-params/getWidgetShellUUID';
import { DETACHED_WINDOW_QUERY_PARAM } from 'conversations-visitor-experience-components/contexts/DetachedWindowContext';
const EDITOR_STAGING_STORAGE_PREFIX = 'hs-conv-detach-editor-staging:';
const getEditorStagingStorageKey = () => {
  const uuid = getWidgetShellUUID();
  return uuid ? `${EDITOR_STAGING_STORAGE_PREFIX}${uuid}` : null;
};
function readAndConsumeEditorStaging() {
  const key = getEditorStagingStorageKey();
  if (!key) {
    return null;
  }
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    localStorage.removeItem(key);
    return parsed;
  } catch (_unused) {
    return null;
  }
}

// Note: isDetachedWindow() is called directly (not via useDetachedWindow())
// because this hook runs inside DetachedWindowProvider itself, which means it
// executes outside the context's own tree. Both read the same URL param, so they
// always agree.
export function useVisitorDetachWindowHostIntegration() {
  const dispatch = useDispatch();
  const sessionId = useSelector(getSessionId);
  const hasMessagesCookieBeenSaved = useSelector(getHasMessagesCookieBeenSaved);
  const stagingText = useSelector(getMessageEditorText);
  const selectedThreadId = useSelector(getSelectedThreadId);
  const didHydrateStagingRef = useRef(false);
  useEffect(() => {
    if (!isDetachedWindow()) {
      return;
    }
    if (!sessionId || didHydrateStagingRef.current) {
      return;
    }
    const parsed = readAndConsumeEditorStaging();
    if (!parsed) {
      didHydrateStagingRef.current = true;
      return;
    }
    if (parsed.stagingText) {
      var _parsed$threadId;
      dispatch(setMessageEditorTextAction({
        threadId: (_parsed$threadId = parsed.threadId) !== null && _parsed$threadId !== void 0 ? _parsed$threadId : STUBBED_THREAD_ID,
        stagingText: parsed.stagingText
      }));
    }
    didHydrateStagingRef.current = true;
  }, [dispatch, sessionId]);
  const prepareDetachedWindowUrl = useCallback(href => {
    const url = new URL(href);
    url.searchParams.set(DETACHED_WINDOW_QUERY_PARAM, 'true');
    if (hasMessagesCookieBeenSaved) {
      url.searchParams.set('isFirstVisitorSession', 'false');
    }
    return url.toString();
  }, [hasMessagesCookieBeenSaved]);
  const persistStateBeforeDetach = useCallback(() => {
    const key = getEditorStagingStorageKey();
    if (!key || !stagingText) {
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify({
        threadId: selectedThreadId,
        stagingText
      }));
    } catch (_unused2) {
      // ignore quota / private mode
    }
  }, [stagingText, selectedThreadId]);
  const getReattachSyncPayload = useCallback(() => {
    if (!sessionId) {
      return undefined;
    }
    const threadId = selectedThreadId != null && selectedThreadId !== STUBBED_THREAD_ID ? selectedThreadId : undefined;
    return threadId != null ? {
      sessionId,
      threadId
    } : {
      sessionId
    };
  }, [sessionId, selectedThreadId]);
  const onHostSurfaceRestored = useCallback(sync => {
    void dispatch(syncVisitorStateAfterDetachedSurfaceCloses(sync));
  }, [dispatch]);
  return {
    prepareDetachedWindowUrl,
    persistStateBeforeDetach,
    getReattachSyncPayload,
    onHostSurfaceRestored
  };
}