import { useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import SpotlightThreadHistoryMenu from 'conversations-visitor-experience-components/visitor-widget/components/SpotlightThreadHistoryMenu';

// @ts-ignore Untyped import
import { getThreadList } from '../../threads/selectors/getThreadList';
import { hasPersistedThreads } from '../../threads/selectors/hasPersistedThreads';
import { getWidgetDataLanguage } from '../../widget-data/selectors/widgetDataSelectors';
import { getThreadId, getLatestMessageTimestamp, getUnseenCount } from '../../threads/operators/threadGetters';
import { getPreviewText, getHasFileAttachment
// @ts-ignore untyped file
} from 'conversations-internal-schema/thread-preview/operators/threadPreviewGetters';
import { relativeTimeSince } from '../../threads/utils/relativeTimeSince';
import { navigateToExistingThread } from '../../navigation/actions/navigateToExistingThread';
import { navigateToStagedThread } from '../../navigation/actions/navigateToStagedThread';
import { getSelectedThreadId } from '../../selected-thread/selectors/getSelectedThreadId';
import { useAppSelector } from '../../buildStore';
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
const SpotlightThreadHistoryMenuContainer = ({
  children
}) => {
  const dispatch = useDispatch();
  const hasThreads = useAppSelector(hasPersistedThreads);
  const selectedThreadId = useAppSelector(getSelectedThreadId);
  const threadList = useAppSelector(state => getThreadList(state));
  const widgetLocale = useAppSelector(getWidgetDataLanguage);
  const handleSelectThread = useCallback(threadId => {
    dispatch(navigateToExistingThread({
      threadId
    }));
  }, [dispatch]);
  const handleNewChat = useCallback(() => {
    dispatch(navigateToStagedThread());
  }, [dispatch]);
  const threads = useMemo(() => {
    if (!threadList) return [];
    return threadList.toArray().map(thread => {
      const threadId = getThreadId(thread);
      const timestamp = getLatestMessageTimestamp(thread);
      return {
        threadId,
        previewText: getPreviewText(thread) || '',
        formattedTimestamp: relativeTimeSince(widgetLocale, timestamp, 'short'),
        hasAttachment: getHasFileAttachment(thread) || false,
        unseenCount: getUnseenCount(thread) || 0
      };
    });
  }, [threadList, widgetLocale]);
  if (!hasThreads) {
    return /*#__PURE__*/_jsx(_Fragment, {
      children: children
    });
  }
  return /*#__PURE__*/_jsx(SpotlightThreadHistoryMenu, {
    currentThreadId: selectedThreadId,
    threads: threads,
    onSelectThread: handleSelectThread,
    onNewChat: handleNewChat,
    triggerContent: children
  });
};
SpotlightThreadHistoryMenuContainer.displayName = 'SpotlightThreadHistoryMenuContainer';
export default SpotlightThreadHistoryMenuContainer;