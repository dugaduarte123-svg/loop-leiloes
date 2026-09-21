import { SETTINGS_VARIABLE, ON_WIDGET_LOAD, ON_EXIT_INTENT } from './constants';
import { booleanInvariant } from '../invariants/booleanInvariant';
import { stringInvariant } from '../invariants/stringInvariant';
import { oneOfListInvariant } from '../invariants/oneOfListInvariant';
export const defaultSettings = {
  loadImmediately: true,
  isFullscreen: false,
  inlineEmbedSelector: '',
  disableAttachment: false,
  enableWidgetCookieBanner: false,
  identificationEmail: '',
  identificationToken: '',
  disableInitialInputFocus: false,
  hideScrollToButton: true,
  hideNewThreadLink: false,
  shouldHideChatOnPrint: false,
  enableEmailCapturedEvent: false
};

/**
 * @param {object} obj
 * @returns {object}
 * @description Removes undefined properties from an object
 * @example definedProps({ a: 1, b: undefined }) // { a: 1 }
 */
function definedProps(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([__, v]) => v !== undefined));
}

/**
 * @returns {object}
 */
export function getExternalApiSettings() {
  const customerSettings = window[SETTINGS_VARIABLE];
  const mergedSettings = Object.assign({}, defaultSettings, definedProps(customerSettings || {}));
  booleanInvariant(mergedSettings.loadImmediately, 'mergedSettings.loadImmediately');
  booleanInvariant(mergedSettings.isFullscreen, 'mergedSettings.isFullscreen');
  booleanInvariant(mergedSettings.disableAttachment, 'mergedSettings.disableAttachment');
  booleanInvariant(mergedSettings.disableInitialInputFocus, 'mergedSettings.disableInitialInputFocus');
  booleanInvariant(mergedSettings.hideNewThreadLink, 'mergedSettings.hideNewThreadLink');
  booleanInvariant(mergedSettings.shouldHideChatOnPrint, 'mergedSettings.shouldHideChatOnPrint');
  booleanInvariant(mergedSettings.enableEmailCapturedEvent, 'mergedSettings.enableEmailCapturedEvent');
  oneOfListInvariant(mergedSettings.enableWidgetCookieBanner, 'mergedSettings.enableWidgetCookieBanner', [false, true, ON_WIDGET_LOAD, ON_EXIT_INTENT]);
  stringInvariant(mergedSettings.inlineEmbedSelector, 'mergedSettings.inlineEmbedSelector');
  stringInvariant(mergedSettings.identificationEmail, 'mergedSettings.identificationEmail');
  stringInvariant(mergedSettings.identificationToken, 'mergedSettings.identificationToken');
  return mergedSettings;
}