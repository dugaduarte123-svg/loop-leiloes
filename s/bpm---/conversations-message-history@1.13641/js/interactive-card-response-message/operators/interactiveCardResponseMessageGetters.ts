import get from 'transmute/get';
import { CARD_ID, CARD_INSTANCE_ID, CONTEXT, DYNAMIC_TEXTS, ERROR_REASON, ID, LOCALE, STATE_NAME, TEMPLATE, TEMPLATE_VERSION, CARD_INSTANCE_VERSION } from '../constants/keyPaths';
export const getCardId = message => get(CARD_ID)(message);
export const getId = message => get(ID)(message);
export const getCardInstanceId = message => get(CARD_INSTANCE_ID)(message);
export const getContext = message => get(CONTEXT)(message);
export const getDynamicTexts = message => get(DYNAMIC_TEXTS)(message);
export const getErrorReason = message => get(ERROR_REASON)(message);
export const getLocale = message => get(LOCALE)(message);
export const getStateName = message => get(STATE_NAME)(message);
export const getStringTemplate = message => get(TEMPLATE)(message);
export const getTemplateVersion = message => get(TEMPLATE_VERSION)(message);
export const getCardInstanceVersion = message => get(CARD_INSTANCE_VERSION)(message);
export const getParsedTemplate = message => {
  const raw = getStringTemplate(message);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;
    return parsed;
  } catch (_unused) {
    return null;
  }
};