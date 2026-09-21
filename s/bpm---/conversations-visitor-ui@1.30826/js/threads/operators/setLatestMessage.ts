import { LATEST_MESSAGE_TIMESTAMP } from '../constants/KeyPaths';
import setIn from 'transmute/setIn';
// @ts-ignore untyped-file
import { getFileAttachments } from 'conversations-message-history/common-message-format/operators/getFileAttachments';
import { getPlainText, getRichText, getTimestamp, getId
// @ts-ignore untyped-file
} from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import { setHasFileAttachment, setPreviewText, setPreviewMessageId
// @ts-ignore untyped-file
} from 'conversations-internal-schema/thread-preview/operators/threadPreviewSetters';
export const setLatestMessage = (message, thread) => {
  let updatedThread = setIn(LATEST_MESSAGE_TIMESTAMP)(getTimestamp(message), thread);
  const fileAttachments = getFileAttachments(message);
  updatedThread = setHasFileAttachment(Boolean(fileAttachments && fileAttachments.length), updatedThread);
  updatedThread = setPreviewText(getRichText(message) || getPlainText(message), updatedThread);
  updatedThread = setPreviewMessageId(getId(message), updatedThread);
  return updatedThread;
};