// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'auto... Remove this comment to see the full error message
import Autolinker from 'autolinker';
const once = function once(func) {
  let alreadyCalled = false;
  let result;
  return function (...args) {
    if (!alreadyCalled) {
      result = func.apply(this, args);
      alreadyCalled = true;
    }
    return result;
  };
};

/**
 * Rejects Autolinker phone matches that are likely false positives.
 * Heuristic: real NA/international numbers (with separators) have digit runs of ≤4.
 * A run of 5+ consecutive digits without a leading '+' is treated as an ID/UTM value.
 * Note: unformatted all-digit numbers (e.g. "12025551234") are never matched by
 * Autolinker in the first place — PhoneMatcher.testMatch() requires at least one
 * non-digit character in the matched text, so this filter never sees them.
 */
function rejectFalsePositivePhone(match) {
  if (match.getType() === 'phone') {
    const text = match.getMatchedText();
    return text.startsWith('+') || !/\d{5,}/.test(text);
  }
  return true;
}
export default {
  get: once(() => {
    return new Autolinker({
      stripPrefix: false,
      replaceFn: rejectFalsePositivePhone
    });
  }),
  getEmailOnly: once(() => {
    return new Autolinker({
      urls: false,
      phone: false,
      hashtag: false,
      mention: false,
      stripPrefix: false
    });
  }),
  getTwitter: once(() => {
    return new Autolinker({
      hashtag: 'twitter',
      mention: 'twitter',
      stripPrefix: false,
      replaceFn: rejectFalsePositivePhone
    });
  })
};