import { deserializeContextFromChirp } from './deserializeContextFromChirp';
function parseTemplate(template) {
  try {
    return JSON.parse(template);
  } catch (_unused) {
    return null;
  }
}
export function parseCardInstanceResponse(cardInstance) {
  var _cardInstance$version;
  return {
    cardInstanceVersion: (_cardInstance$version = cardInstance.version) !== null && _cardInstance$version !== void 0 ? _cardInstance$version : 1,
    stateName: cardInstance.stateName,
    body: cardInstance.template ? parseTemplate(cardInstance.template) : null,
    context: deserializeContextFromChirp(cardInstance.context),
    dynamicText: cardInstance.dynamicTexts,
    locale: cardInstance.locale
  };
}