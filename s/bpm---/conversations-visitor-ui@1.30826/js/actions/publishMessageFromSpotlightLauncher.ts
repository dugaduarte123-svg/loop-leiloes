// @ts-ignore untyped file
import { publishVisitorMessage } from '../pubsub/actions/publishVisitorMessage';
import { toggleOpen } from './WidgetActions';
import { updateView } from '../current-view/actions/updateView';
import { THREAD_VIEW } from 'conversations-visitor-experience-components/visitor-widget/constants/views';
import { buildRichText } from '../pubsub/util/buildRichText';
// @ts-ignore untyped file
import { getFileUploadListForCurrentThreadId } from '../file-uploads/selectors/getFileUploadListForCurrentThreadId';
// @ts-ignore untyped file
import { buildFileAttachment } from '../file-uploads/operators/buildFileAttachment';
// @ts-ignore untyped file
import { clearAttachments } from '../file-uploads/actions/clearAttachments';
// @ts-ignore untyped file
import { getCurrentThreadId } from '../thread-history/selectors/getCurrentThreadId';
import Raven from 'raven-js';
export function publishMessageFromSpotlightLauncher(text) {
  return (dispatch, getState) => {
    const richText = buildRichText(text);
    const stagedAttachments = getFileUploadListForCurrentThreadId(getState());
    const fileAttachment = buildFileAttachment(stagedAttachments);
    return dispatch(publishVisitorMessage({
      text,
      richText,
      quickReply: null,
      fileAttachment
    })).then(() => {
      const threadId = getCurrentThreadId(getState());
      if (threadId) {
        dispatch(clearAttachments(threadId));
      }
      dispatch(toggleOpen({
        isOpened: true,
        isUser: true,
        openedFrom: 'spotlight launcher'
      }));
      dispatch(updateView(THREAD_VIEW));
    }).catch(error => {
      Raven.captureException(error);
    });
  };
}