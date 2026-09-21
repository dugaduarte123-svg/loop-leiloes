import I18n from 'I18n';
import { getLocale, getOptions, alternativeFractionCurrencies } from './internal/light/intlFormatters';
// @ts-ignore untyped
import { lookup } from './internal/translateHelpers';
import devLogger from 'react-utils/devLogger';
const getDefaultCurrencyCodeForLocale = locale => {
  if (!I18n.currencySymbols['USD']) {
    console.error('It looks like currency data is not available. Are you using the new I18n loader and forgot to import currencies? See go/new-i18n');
  }

  // The default currency code for a given locale is determined by the locale definition in i18n-data and retrieved via "lookup('number.currency.format.unit')"
  // https://git.hubteam.com/HubSpot/i18n-data/tree/master/data/locales
  const unit = lookup('number.currency.format.unit', {
    locale
  });
  if (!unit) return 'USD';
  const currencyBySymbol = Object.values(I18n.currencySymbols).find(data => data.symbol === unit);
  if (currencyBySymbol) return currencyBySymbol.code;

  // If the symbol is not found, try to find the symbol_native (eg. for 'en-in' locale, only a corresponding symbol_native is available)
  const currencyByNativeSymbol = Object.values(I18n.currencySymbols).find(data => data.symbol_native === unit);
  return (currencyByNativeSymbol === null || currencyByNativeSymbol === void 0 ? void 0 : currencyByNativeSymbol.code) || 'USD';
};
export function formatIntlCurrency(number, options = {}) {
  var _options$parts;
  const opts = Object.assign({
    style: 'currency',
    currency: options.currencyCode || getDefaultCurrencyCodeForLocale(getLocale(options))
  }, getOptions(options));
  if (opts.currency && alternativeFractionCurrencies[opts.currency]) {
    opts.maximumFractionDigits = alternativeFractionCurrencies[opts.currency];
  }
  if (options.formatNegativeValuesWithParenthesis && number < 0) {
    // In many locales, accounting format means to wrap the number with parentheses instead of appending a minus sign (eg. English)
    // In other locales, a negative value is indicated by a minus sign (eg. German)
    opts.currencySign = 'accounting';
  }
  if (typeof options.unit === 'string') {
    const currencyParts = {
      currency: options.unit,
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/formatToParts#literal
      // parts.literal represents any literal strings or whitespace in the formatted number. If there is no currency to display we should remove unnecessary whitespace
      literal: !options.unit ? '' : undefined
    };
    options.parts = typeof options.parts === 'object' ? Object.assign({}, currencyParts, options.parts) : currencyParts;
  }
  if (!options.currencyCode && !((_options$parts = options.parts) !== null && _options$parts !== void 0 && _options$parts.currency) && typeof options.unit !== 'string') {
    const locale = getLocale(options);
    const defaultCurrencyCode = getDefaultCurrencyCodeForLocale(locale);
    devLogger.warn({
      message: `I18n: Missing currencyCode in call to formatIntlCurrency(). Falling back to using default currency code: "${defaultCurrencyCode}" for the provided locale: "${locale}". Please provide a currencyCode to avoid this warning.`,
      key: `I18n.formatIntlCurrency-missing`
    });
  }
  const formatter = new Intl.NumberFormat(getLocale(options), opts);
  if (options.parts) {
    return formatter.formatToParts(number).reduce((acc, {
      type,
      value
    }) => `${acc}${options.parts && typeof options.parts[type] !== 'undefined' ? options.parts[type] : value}`, '');
  }
  return formatter.format(number);
}