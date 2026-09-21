import I18n from 'I18n';
export const DEFAULT_MAX_MESSAGE_LENGTH = 1024;
function isMessageWithinLimit(text) {
  return text.length < DEFAULT_MAX_MESSAGE_LENGTH;
}
export function getValidationMessage(text) {
  if (!isMessageWithinLimit(text)) {
    return I18n.text('conversations-visitor-experience-components.chatTextArea.validationMessage');
  }
  return '';
}