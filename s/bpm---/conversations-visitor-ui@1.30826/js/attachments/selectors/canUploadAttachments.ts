import { createSelector } from '@reduxjs/toolkit';
// @ts-ignore - Untyped import
import { getFileUploadListForCurrentThreadId } from '../../file-uploads/selectors/getFileUploadListForCurrentThreadId';
// @ts-ignore - Untyped import
import { hasUnansweredQuickReplyMessage as hasUnansweredQuickReplyMessageSelector } from '../../selectors/chatSelectors';
// @ts-ignore - Untyped import
import { getAllowUserInput } from '../../thread-histories/selectors/getAllowUserInput';
// @ts-ignore - Untyped import
import { getCurrentThreadId } from '../../thread-history/selectors/getCurrentThreadId';
import { STUBBED_THREAD_ID } from '../../threads/constants/stubbedThreadId';
import { getShouldDisableAttachments } from '../../widget-ui/selectors/getShouldDisableAttachments';

// TODO: Better typing for Thread once the immutable Record is migrated to TypeScript

const threadFromProps = (_state, props) => props.thread;
export const canUploadAttachments = createSelector([getAllowUserInput, getFileUploadListForCurrentThreadId, hasUnansweredQuickReplyMessageSelector, getShouldDisableAttachments, threadFromProps], (allowUserInput, uploadList, hasUnansweredQuickReplyMessage, shouldHideAttachments, __thread) => {
  if (getCurrentThreadId(__thread) === STUBBED_THREAD_ID || !allowUserInput && hasUnansweredQuickReplyMessage || shouldHideAttachments) {
    return false;
  } else if (!uploadList) {
    return true;
  }
  return !uploadList.size;
});