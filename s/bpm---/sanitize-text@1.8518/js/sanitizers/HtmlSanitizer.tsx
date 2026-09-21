import { allowMathML, config, getIframeHtmlConfig } from './SanitizeConfiguration';
import memoize from 'transmute/memoize';
import Autolinker from './Autolinker';
import { sanitize } from './Sanitize';
import { fixImages } from '../transformers/fixImages';
import { removeOutlookLineBreaks } from '../transformers/removeOutlookLineBreaks';
import { removeReply, REPLY_CLASSLIST, OFFICE_365_REPLY_ID } from '../transformers/removeReply';
import { replaceGmailDivs } from '../transformers/replaceGmailDivs';
import { removeGmailLineBreakBeforeReply } from '../transformers/removeGmailLineBreakBeforeReply';
import { openLinksInNewTab } from '../transformers/openLinksInNewTab';
import { removeEmailSignature, SIGNATURE_CLASSLIST, GMAIL_SIGNATURE } from '../transformers/removeEmailSignature';
import { allowlistIframes } from '../transformers/allowlistIframes';
import { getTextContentFromHtml as TextSanitizer_getTextContentFromHtml } from './TextSanitizer';
export const hasReplyOrSignature = memoize(body => {
  return !![...REPLY_CLASSLIST, OFFICE_365_REPLY_ID, ...SIGNATURE_CLASSLIST, GMAIL_SIGNATURE].find(replyIdentifier => body.includes(replyIdentifier));
});

// Continue to export `getTextContentFromHtml` from `HtmlSanitizer` for backwards-compatibility,
// until all usages are updated to import from `TextSanitizer`.
// See https://git.hubteam.com/HubSpot/CRM-Issues/issues/8699
export const getTextContentFromHtml = TextSanitizer_getTextContentFromHtml;
export const formatThreadedEmailPreview = memoize((text, charLimit = 400) => {
  const transformers = [removeOutlookLineBreaks, replaceGmailDivs, removeReply];
  const formattedText = sanitize(text, config.TEXTONLY, transformers);
  return formattedText && formattedText.length > charLimit ? formattedText.substring(0, charLimit) : formattedText;
});
const cleanHtmlWithoutEmailReplies = memoize(({
  text,
  shouldRemoveGmailLineBreakBeforeReply = false,
  shouldRemoveEmailSignature = true,
  htmlConfig = config.HTML,
  shouldOpenLinksInNewTab = false,
  allowedDomainsForIframe = []
}) => {
  const optionalTransformers = [...(shouldRemoveGmailLineBreakBeforeReply ? [removeGmailLineBreakBeforeReply] : []), ...(shouldRemoveEmailSignature ? [removeEmailSignature] : []), ...(shouldOpenLinksInNewTab ? [openLinksInNewTab] : [])];
  const transformers = [removeOutlookLineBreaks, replaceGmailDivs, removeReply, fixImages, args => allowlistIframes(Object.assign({}, args, {
    allowedDomainsForIframe
  })), ...optionalTransformers];
  return sanitize(text, htmlConfig, transformers);
});
const cleanHtmlWithEmailReplies = memoize(({
  text,
  shouldRemoveGmailLineBreakBeforeReply = false,
  shouldRemoveEmailSignature = false,
  htmlConfig = config.HTML,
  shouldOpenLinksInNewTab = false,
  allowedDomainsForIframe = []
}) => {
  const optionalTransformers = [...(shouldRemoveGmailLineBreakBeforeReply ? [removeGmailLineBreakBeforeReply] : []), ...(shouldRemoveEmailSignature ? [removeEmailSignature] : []), ...(shouldOpenLinksInNewTab ? [openLinksInNewTab] : [])];
  const transformers = [removeOutlookLineBreaks, replaceGmailDivs, fixImages, args => allowlistIframes(Object.assign({}, args, {
    allowedDomainsForIframe
  })), ...optionalTransformers];
  return sanitize(text, htmlConfig, transformers);
});
export const escapeBrackets = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// https://issues.hubspotcentral.com/browse/CRM-49974
// Emails with the below pattern crash Chrome within crm-records-ui
// but we do not know why. To fix this we are patching this by removing
// the bad HTML which is empty space.
// "&nbsp;      <" -> "&nbsp;<"
// See this PR for more context: https://git.hubteam.com/HubSpot/CRM/pull/33838
export const removeMalformedHtml = text => text.replace(/&nbsp;\s+</gi, '&nbsp;<');

// Detect presence of foreign-namespace root tags (svg or math) in either
// encoded (`&lt;svg`) or already-decoded (`<svg`) forms.
const FOREIGN_NAMESPACE_TAG_REGEX = /(?:<|&lt;)\/?(?:svg|math)\b/i;
export const decodeTagsForForeignContent = text => {
  if (!FOREIGN_NAMESPACE_TAG_REGEX.test(text)) {
    return text;
  }
  return text.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
};
const preprocessRichText = text => {
  return decodeTagsForForeignContent(removeMalformedHtml(text));
};
export const formatHtml = (body, formattingOptions = {}) => {
  const {
    allowedDomainsForIframe,
    isPlainText,
    shouldAutolinkTwitter,
    shouldIncludeReplies,
    shouldOpenLinksInNewTab,
    shouldPreserveNewlines,
    shouldPreventAutoLinker,
    shouldRemoveEmailSignature,
    shouldRemoveGmailLineBreakBeforeReply,
    shouldPreserveMathML,
    config: customConfig
  } = formattingOptions;
  if (!body) {
    return '';
  }
  let htmlConfig = customConfig || (allowedDomainsForIframe ? getIframeHtmlConfig() : config.HTML);
  if (shouldPreserveMathML && htmlConfig && 'attributes' in htmlConfig) {
    htmlConfig = allowMathML(htmlConfig);
  }
  const bodyToFormat = isPlainText ? escapeBrackets(body) : preprocessRichText(body);
  let formattedBody = shouldIncludeReplies ? cleanHtmlWithEmailReplies({
    text: bodyToFormat,
    shouldRemoveGmailLineBreakBeforeReply,
    shouldRemoveEmailSignature,
    shouldOpenLinksInNewTab,
    htmlConfig,
    allowedDomainsForIframe
  }) : cleanHtmlWithoutEmailReplies({
    text: bodyToFormat,
    shouldRemoveEmailSignature,
    shouldRemoveGmailLineBreakBeforeReply,
    shouldOpenLinksInNewTab,
    htmlConfig,
    allowedDomainsForIframe
  });
  formattedBody = formattedBody === null || isPlainText || shouldPreserveNewlines ? formattedBody : formattedBody.replace('\n', '');
  const autolinker = shouldAutolinkTwitter ? Autolinker.getTwitter() : Autolinker.get();
  const linkedBody = Autolinker.getEmailOnly().link(formattedBody);
  return shouldPreventAutoLinker ? linkedBody : autolinker.link(linkedBody);
};
export { OFFICE_365_REPLY_ID };

/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking
if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}