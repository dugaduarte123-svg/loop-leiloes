import get from 'transmute/get';
import { EMAIL_METADATA } from '../constants/attachmentTypes';
import { getAttachments } from './getAttachments';
import { EmailMetadataTypename } from '../../../__generated__/chirp/com/hubspot/cv/tickets/timeline/rpc/TicketTimelineRpc';
export const getEmailMetadata = commonMessage => {
  const attachments = getAttachments(commonMessage);
  if (attachments) {
    return attachments.find(attachmentObject => Boolean(attachmentObject && get('@type', attachmentObject) === EMAIL_METADATA));
  }
  return undefined;
};
export function getEmailMetadataPlainJS(commonMessage) {
  var _commonMessage$attach;
  return (_commonMessage$attach = commonMessage.attachments.find(isEmailMetadata)) !== null && _commonMessage$attach !== void 0 ? _commonMessage$attach : null;
}
export function isEmailMetadata(attachment) {
  if ('@type' in attachment) {
    return attachment['@type'] === EMAIL_METADATA;
  }
  if ('__typename' in attachment) {
    return attachment.__typename === EmailMetadataTypename;
  }
  return false;
}