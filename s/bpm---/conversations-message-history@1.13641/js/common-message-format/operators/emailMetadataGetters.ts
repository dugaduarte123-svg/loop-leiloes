import get from 'transmute/get';
import { getEmailMetadata } from './getEmailMetadata';
const makeGetMetadataPropertyFromCommonMessage = metadataGetter => commonMessage => {
  const metadata = getEmailMetadata(commonMessage);
  return metadata && metadataGetter(metadata);
};
export const getMetadataSubject = get('subject');
export const getSubject = makeGetMetadataPropertyFromCommonMessage(getMetadataSubject);
export const getMetadataFrom = get('from');
export const getFrom = makeGetMetadataPropertyFromCommonMessage(getMetadataFrom);
export const getMetadataFromAddress = metadata => {
  const from = getMetadataFrom(metadata);
  return from && get('email', from);
};
export const getFromAddress = makeGetMetadataPropertyFromCommonMessage(getMetadataFromAddress);
export const getMetadataFromName = metadata => {
  const from = getMetadataFrom(metadata);
  return from && get('name', from);
};
export const getFromName = makeGetMetadataPropertyFromCommonMessage(getMetadataFromName);
const getOriginalSender = get('originalSender');
export const getMetadataOriginalSenderEmail = metadata => {
  const originalSender = getOriginalSender(metadata);
  return originalSender && get('email', originalSender);
};
export const getOriginalSenderEmail = makeGetMetadataPropertyFromCommonMessage(getMetadataOriginalSenderEmail);
export const getMetadataOriginalSenderName = metadata => {
  const originalSender = getOriginalSender(metadata);
  return originalSender && get('name', originalSender);
};
export const getOriginalSenderName = makeGetMetadataPropertyFromCommonMessage(getMetadataOriginalSenderName);
export const getMetadataConnectedAccountAddress = get('connectedAccountAddress');
export const getConnectedAccountAddress = makeGetMetadataPropertyFromCommonMessage(getMetadataConnectedAccountAddress);
export const getMetadataHasReplies = get('hasReplies');
export const getHasReplies = makeGetMetadataPropertyFromCommonMessage(getMetadataHasReplies);
export const getMetadataPreviousRepliesHtml = get('previousRepliesHtml');
export const getPreviousRepliesHtml = makeGetMetadataPropertyFromCommonMessage(getMetadataPreviousRepliesHtml);
export const getMetadataPreviousRepliesPlainText = get('previousRepliesPlainText');
export const getPreviousRepliesPlainText = makeGetMetadataPropertyFromCommonMessage(getMetadataPreviousRepliesPlainText);
export const getMetadataIsMemberOfForwardedSubthread = get('memberOfForwardedSubthread');
export const getIsMemberOfForwardedSubthread = makeGetMetadataPropertyFromCommonMessage(getMetadataIsMemberOfForwardedSubthread);
export const getMetadataIsForward = get('forward');
export const getIsForward = makeGetMetadataPropertyFromCommonMessage(getMetadataIsForward);
export const getMetadataClipStatus = get('clipStatus');
export const getClipStatus = makeGetMetadataPropertyFromCommonMessage(getMetadataClipStatus);
export const getMetadataTemplateId = get('templateId');
export const getTemplateId = makeGetMetadataPropertyFromCommonMessage(getMetadataTemplateId);
export const getMetadataEmailAuthenticationStatus = get('emailAuthenticationStatus');
export const getEmailAuthenticationStatus = makeGetMetadataPropertyFromCommonMessage(getMetadataEmailAuthenticationStatus);