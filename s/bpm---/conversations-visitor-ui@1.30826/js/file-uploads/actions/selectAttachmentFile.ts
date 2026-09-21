import FileUploadRecord from 'conversations-internal-schema/file-upload/records/FileUploadRecord';
import { trackInteraction } from '../../usage-tracking/actions/trackInteraction';
import { EVENT_NAMES, EVENT_KEYS } from '../../usage-tracking/constants/eventNames';
import { validationErrorToTrackingFailureType } from '../util/validationErrorToTrackingFailureType';
// @ts-ignore not typed
import { attachmentError } from './attachmentError';
import { getThreadId } from '../../threads/operators/threadGetters';
// @ts-ignore not typed
import { validateAttachmentFile } from '../util/validateAttachmentFile';
import { uploadAttachment } from './uploadAttachment';
export const selectAttachmentFile = ({
  file,
  thread,
  source
}) => dispatch => {
  const threadId = getThreadId(thread);
  return validateAttachmentFile(file).then(() => {
    const attachment = new FileUploadRecord({
      file,
      uploadProgress: 0
    });
    return dispatch(uploadAttachment({
      attachment,
      threadId,
      source
    }));
  }).catch(error => {
    dispatch(attachmentError(error, threadId));
    dispatch(trackInteraction(EVENT_NAMES.WIDGET_INTERACTION, {
      action: 'failed to attach file',
      'failure-type': validationErrorToTrackingFailureType(error),
      source
    }, undefined, undefined, EVENT_KEYS.FAILED_TO_ATTACH_FILE));
  });
};