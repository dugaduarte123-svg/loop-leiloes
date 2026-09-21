import curry from 'transmute/curry';
import get from 'transmute/get';
import set from 'transmute/set';
import getIn from 'transmute/getIn';
import { RECIPIENT_FIELD } from '../constants/keyPaths';
import { getRecipients, getAttachments } from './commonMessageGetters';
/**
 * The modern home of common message operators as we
 * look to get off of ./commonMessageFormatSetters, which
 * has a lot of edge-casing and checks introduced during
 * record migrations.
 */
export const setId = set('id');
export const setText = set('text');
export const setTimestamp = set('timestamp');
export const setStatus = set('status');
export const setRichText = set('richText');
export const setChannelInstanceId = set('channelInstanceId');
export const setGenericChannelId = set('genericChannelId');
export const setIntegrationId = set('integrationId');
export const setMessageDirection = set('direction');
export const setRecipients = set('recipients');
export const setSenders = set('senders');
export const setAttachments = set('attachments');

/* Replace recipients for a field */
export const setRecipientField = curry((field, recipients, commonMessage) => {
  const currentRecipients = getRecipients(commonMessage);
  // Filter out all the recipients for a field
  const filteredRecipients = currentRecipients.filter(recipient => {
    return getIn(RECIPIENT_FIELD, recipient) !== field;
  }).filter(recipient => getIn(RECIPIENT_FIELD, recipient) !== null);
  // Add back the new recipiets to the list
  const nextRecipients = filteredRecipients.concat(recipients).toList();
  return setRecipients(nextRecipients, commonMessage);
});

/* Add or replace a attachment based on attachmentType */
export const setAttachment = curry((attachment, commonMessage) => {
  const attachmentType = get('@type', attachment);
  const attachments = getAttachments(commonMessage);
  const filteredAttachments = attachments.filter(attachmentObj => get('@type', attachmentObj) !== attachmentType).toList();
  return setAttachments(filteredAttachments.push(attachment), commonMessage);
});