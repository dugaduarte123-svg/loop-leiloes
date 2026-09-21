import { List } from 'immutable';
import get from 'transmute/get';
import { FILES, MESSAGE_HEADER } from '../constants/attachmentTypes';
import { getFileIds } from './fileAttachmentGetters';
import { getAttachments } from './getAttachments';
import { FILE_ID } from '../constants/messageHeaderAttachmentKeyPaths';
/**
 *
 * @param {GenericMessageType} message - Generic Message Type
 * @returns {List<number>} list of file attachment ids in message
 *
 */
export const fileAttachmentIdsInMessage = message => {
  const attachments = getAttachments(message) || List();
  let fileIds = List();
  // get fileIds from FILES attachment
  const fileAttachment = attachments.find(attachment => {
    return get('@type', attachment) === FILES;
  });
  if (fileAttachment) {
    fileIds = fileIds.merge(getFileIds(fileAttachment));
  }
  // get fileIds from MESSAGE_HEADER attachment
  const headerAttachment = attachments.find(attachment => {
    return get('@type', attachment) === MESSAGE_HEADER;
  });
  const newFileId = get(FILE_ID, headerAttachment);
  if (headerAttachment && newFileId) {
    fileIds = fileIds.push(newFileId);
  }
  return fileIds;
};