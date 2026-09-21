// @ts-ignore untyped
import getDateNumberFormattingLocale from '../../getDateNumberFormattingLocale';
export const alternativeFractionCurrencies = {
  CLP: 2,
  COP: 2
};
export const INTL_DEFAULT_MIN_FRACTIONAL_DIGITS = 2;
export const getLocale = options => {
  return options && options.locale || getDateNumberFormattingLocale();
};
export const getOptions = options => {
  const opts = {};
  if (options) {
    if (typeof options.precision === 'number') {
      opts.maximumFractionDigits = options.precision;
      if (options.stripInsignificantZeros === false) {
        opts.minimumFractionDigits = options.precision;
      }
    }
    if (typeof options.maximumFractionDigits === 'number') {
      opts.maximumFractionDigits = options.maximumFractionDigits;
    }
    if (options.abbreviate === true) {
      var _opts$maximumFraction;
      opts.notation = 'compact';
      // Matching FormattedCurrency's default behavior of having 0 decimal places when abbreviating
      opts.maximumFractionDigits = (_opts$maximumFraction = opts.maximumFractionDigits) !== null && _opts$maximumFraction !== void 0 ? _opts$maximumFraction : 0;
      opts.trailingZeroDisplay = 'stripIfInteger';
    }
    if (opts.maximumFractionDigits !== undefined && opts.maximumFractionDigits < INTL_DEFAULT_MIN_FRACTIONAL_DIGITS) {
      // https://github.com/andyearnshaw/Intl.js/issues/123
      opts.minimumFractionDigits = opts.maximumFractionDigits;
    }
    if (options.useCurrencyCode === true) {
      opts.currencyDisplay = 'code';
    }
    if (options.simplifyCurrency === true || options.trailingZeroDisplay === 'stripIfInteger') {
      opts.trailingZeroDisplay = 'stripIfInteger';
    }
    if (typeof options.currencyDisplay === 'string') {
      opts.currencyDisplay = options.currencyDisplay;
    }
    if (typeof options.currencySign === 'string') {
      opts.currencySign = options.currencySign;
    }
  }
  return opts;
};