import { getStringTemplate, getStateName, getErrorReason, getContext, getDynamicTexts, getLocale, getCardInstanceVersion } from 'conversations-message-history/interactive-card-response-message/operators/interactiveCardResponseMessageGetters';
import { cardResponseReceived } from '../slice/interactiveCardsSlice';
import { deserializeContextFromChirp } from '../operators/deserializeContextFromChirp';
import { cancelPendingActionTimeout } from './interactiveCardTimeouts';
export const interactiveCardResponseReceived = message => dispatch => {
  var _getCardInstanceVersi, _getStateName, _getDynamicTexts, _getLocale, _getErrorReason;
  const cardInstanceId = message.get('cardInstanceId');
  if (!cardInstanceId) {
    return;
  }
  cancelPendingActionTimeout(cardInstanceId);
  const rawTemplate = getStringTemplate(message);
  let body;
  if (rawTemplate) {
    try {
      body = JSON.parse(rawTemplate);
    } catch (_unused) {
      body = undefined;
    }
  }
  const rawContext = getContext(message);
  const context = rawContext ? deserializeContextFromChirp(rawContext) : undefined;
  dispatch(cardResponseReceived({
    cardInstanceId,
    cardInstanceVersion: (_getCardInstanceVersi = getCardInstanceVersion(message)) !== null && _getCardInstanceVersi !== void 0 ? _getCardInstanceVersi : undefined,
    stateName: (_getStateName = getStateName(message)) !== null && _getStateName !== void 0 ? _getStateName : undefined,
    body,
    context,
    dynamicText: (_getDynamicTexts = getDynamicTexts(message)) !== null && _getDynamicTexts !== void 0 ? _getDynamicTexts : undefined,
    locale: (_getLocale = getLocale(message)) !== null && _getLocale !== void 0 ? _getLocale : undefined,
    errorReason: (_getErrorReason = getErrorReason(message)) !== null && _getErrorReason !== void 0 ? _getErrorReason : ''
  }));
};