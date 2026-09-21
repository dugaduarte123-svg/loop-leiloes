import { getFile, getLocalId } from 'conversations-internal-schema/file-upload/operators/fileUploadGetters';
import { trackInteraction } from '../../usage-tracking/actions/trackInteraction';
import { EVENT_NAMES, EVENT_KEYS } from '../../usage-tracking/constants/eventNames';
import { getSessionId } from '../../selectors/widgetDataSelectors/getSessionId';
// @ts-ignore not typed
import { fetchAttachmentUploadUrlClient } from '../clients/fetchAttachmentUploadUrlClient';
// @ts-ignore not typed
import { uploadAttachmentClient } from '../clients/uploadAttachmentClient';
import { createFormDataForAttachment } from '../util/createFormDataForAttachment';
// @ts-ignore not typed
import { attachmentUploadStart } from '../../file-uploads/actions/attachmentUploadStart';
// @ts-ignore not typed
import { attachmentUploadComplete } from '../../file-uploads/actions/attachmentUploadComplete';
import { INVALID_FILE_TYPE, UPLOAD_ERROR } from '../../file-uploads/constants/attachmentErrors';
// @ts-ignore not typed
import { handleAttachmentUploadProgress } from './handleAttachmentUploadProgress';
// @ts-ignore not typed
import { attachmentError } from '../../file-uploads/actions/attachmentError';
import { FILE_MANAGER_API_PREFIX } from '../constants/fileUploadsConstants';
export const uploadAttachment = ({
  attachment,
  threadId,
  source
}) => (dispatch, getState) => {
  const uploadStartTimestamp = Date.now();
  dispatch(attachmentUploadStart({
    attachment,
    threadId
  }));
  const sessionId = getSessionId(getState());
  const localId = getLocalId(attachment);
  const file = getFile(attachment);
  if (!file) {
    dispatch(attachmentError(UPLOAD_ERROR, threadId));
    return Promise.reject(new Error('File is required to upload attachment'));
  }
  const formData = createFormDataForAttachment({
    file
  });
  return fetchAttachmentUploadUrlClient({
    sessionId,
    threadId
  }).then(({
    uploadUrl
  }) => uploadAttachmentClient({
    formData,
    onProgress: ({
      loaded,
      total
    }) => {
      dispatch(handleAttachmentUploadProgress({
        localId,
        threadId,
        loaded,
        total
      }));
    },
    uploadUrl: `${FILE_MANAGER_API_PREFIX}/${uploadUrl}`
  })).then(({
    objects: [uploadedFile]
  }) => {
    const uploadCompleteTimestamp = Date.now();
    dispatch(attachmentUploadComplete({
      localId,
      threadId,
      fileId: uploadedFile.id,
      uploadedFile
    }));
    dispatch(trackInteraction(EVENT_NAMES.WIDGET_INTERACTION, {
      action: 'attached file',
      'attachment-type': uploadedFile.extension,
      'attachment-size-bytes': file === null || file === void 0 ? void 0 : file.size,
      'upload-time-ms': uploadCompleteTimestamp - uploadStartTimestamp,
      source
    }, undefined, undefined, EVENT_KEYS.ATTACHED_FILE));
  }).catch(err => {
    var _err$responseJSON;
    if (err !== null && err !== void 0 && (_err$responseJSON = err.responseJSON) !== null && _err$responseJSON !== void 0 && (_err$responseJSON = _err$responseJSON.message) !== null && _err$responseJSON !== void 0 && _err$responseJSON.includes('not allowed')) {
      dispatch(attachmentError(INVALID_FILE_TYPE, threadId));
      dispatch(trackInteraction(EVENT_NAMES.WIDGET_INTERACTION, {
        action: 'failed to attach file',
        'failure-type': 'invalid file type',
        source
      }, undefined, undefined, EVENT_KEYS.FAILED_TO_ATTACH_FILE));
    } else {
      dispatch(attachmentError(UPLOAD_ERROR, threadId));
      dispatch(trackInteraction(EVENT_NAMES.WIDGET_INTERACTION, {
        action: 'failed to attach file',
        'failure-type': 'upload error',
        source
      }, undefined, undefined, EVENT_KEYS.FAILED_TO_ATTACH_FILE));
    }
  });
};