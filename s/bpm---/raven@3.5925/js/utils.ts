"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.each = each;
exports.fill = fill;
exports.hasKey = hasKey;
exports.isEmptyObject = isEmptyObject;
exports.isError = isError;
exports.isErrorEvent = isErrorEvent;
exports.isFunction = isFunction;
exports.isObject = isObject;
exports.isSameException = isSameException;
exports.isSameObject = isSameObject;
exports.isSameStacktrace = isSameStacktrace;
exports.isString = isString;
exports.isUndefined = isUndefined;
exports.joinRegExp = joinRegExp;
exports.objectFrozen = objectFrozen;
exports.objectMerge = objectMerge;
exports.parseUrl = parseUrl;
exports.redactSensitiveUrlParams = redactSensitiveUrlParams;
exports.supportsErrorEvent = supportsErrorEvent;
exports.truncate = truncate;
exports.urlencode = urlencode;
exports.uuid4 = uuid4;
exports.wrappedCallback = wrappedCallback;
const _window = typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : {};
function isObject(what) {
  return typeof what === 'object' && what !== null;
}

// Yanked from https://git.io/vS8DV re-used under CC0
// with some tiny modifications
function isError(value) {
  switch ({}.toString.call(value)) {
    case '[object Error]':
      return true;
    case '[object Exception]':
      return true;
    case '[object DOMException]':
      return true;
    default:
      return value instanceof Error;
  }
}
function isErrorEvent(value) {
  return supportsErrorEvent() && {}.toString.call(value) === '[object ErrorEvent]';
}
function isUndefined(what) {
  return what === void 0;
}
function isFunction(what) {
  return typeof what === 'function';
}
function isString(what) {
  return Object.prototype.toString.call(what) === '[object String]';
}
function isEmptyObject(what) {
  for (const _ in what) return false; // eslint-disable-line guard-for-in, no-unused-vars
  return true;
}
function supportsErrorEvent() {
  try {
    new ErrorEvent(''); // eslint-disable-line no-new
    return true;
  } catch (e) {
    return false;
  }
}
function wrappedCallback(callback) {
  return function dataCallback(data, original) {
    const normalizedData = callback(data) || data;
    if (original) {
      return original(normalizedData) || normalizedData;
    }
    return normalizedData;
  };
}
function each(obj, callback) {
  if (isUndefined(obj.length)) {
    for (const i in obj) {
      if (hasKey(obj, i)) {
        callback.call(null, i, obj[i]);
      }
    }
  } else {
    const j = obj.length;
    if (j) {
      for (let i = 0; i < j; i++) {
        callback.call(null, i, obj[i]);
      }
    }
  }
}
function objectMerge(obj1, obj2) {
  if (!obj2) {
    return obj1;
  }
  each(obj2, (key, value) => {
    obj1[key] = value;
  });
  return obj1;
}

/**
 * This function is only used for react-native.
 * react-native freezes object that have already been sent over the
 * js bridge. We need this function in order to check if the object is frozen.
 * So it's ok that objectFrozen returns false if Object.isFrozen is not
 * supported because it's not relevant for other "platforms". See related issue:
 * https://github.com/getsentry/react-native-sentry/issues/57
 */
function objectFrozen(obj) {
  if (!Object.isFrozen) {
    return false;
  }
  return Object.isFrozen(obj);
}
function truncate(str, max) {
  return !max || str.length <= max ? str : `${str.substr(0, max)}\u2026`;
}

/**
 * hasKey, a better form of hasOwnProperty
 * Example: hasKey(MainHostObject, property) === true/false
 *
 * @param {Object} host object to check property
 * @param {string} key to check
 */
function hasKey(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

// Combine an array of regular expressions and strings into one large regexp
// Be mad.
function joinRegExp(patterns) {
  const sources = [];
  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    if (isString(pattern)) {
      // If it's a string, we need to escape it
      // Taken from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
      sources.push(pattern.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1'));
    } else if (pattern instanceof RegExp) {
      // If it's a regexp already, we want to extract the source
      sources.push(pattern.source);
    }
    // Intentionally skip other cases
  }
  return new RegExp(sources.join('|'), 'i');
}
function urlencode(o) {
  const pairs = [];
  each(o, (key, value) => {
    pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  });
  return pairs.join('&');
}

// borrowed from https://tools.ietf.org/html/rfc3986#appendix-B
// intentionally using regex and not <a/> href parsing trick because React Native and other
// environments where DOM might not be available
function parseUrl(url) {
  const match = url.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
  if (!match) return {};

  // coerce to undefined values to empty string so we don't get 'undefined'
  const query = match[6] || '';
  const fragment = match[8] || '';
  return {
    protocol: match[2],
    host: match[4],
    path: match[5],
    relative: `${match[5]}${query}${fragment}` // everything minus origin
  };
}
function uuid4() {
  const crypto = _window.crypto || _window.msCrypto;
  if (!isUndefined(crypto) && crypto.getRandomValues) {
    // Use window.crypto API if available
    const arr = new Uint16Array(8);
    crypto.getRandomValues(arr);

    // set 4 in byte 7
    arr[3] = arr[3] & 0xfff | 0x4000; // eslint-disable-line no-bitwise
    // set 2 most significant bits of byte 9 to '10'
    arr[4] = arr[4] & 0x3fff | 0x8000; // eslint-disable-line no-bitwise

    const pad = num => {
      let v = num.toString(16);
      while (v.length < 4) {
        v = `0${v}`;
      }
      return v;
    };
    return pad(arr[0]) + pad(arr[1]) + pad(arr[2]) + pad(arr[3]) + pad(arr[4]) + pad(arr[5]) + pad(arr[6]) + pad(arr[7]);
  } else {
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0; // eslint-disable-line no-bitwise
      const v = c === 'x' ? r : r & 0x3 | 0x8; // eslint-disable-line no-bitwise
      return v.toString(16);
    });
  }
}

/**
 * Returns true if either a OR b is truthy, but not both
 */
function isOnlyOneTruthy(a, b) {
  return !!a !== !!b;
}

/**
 * Returns true if the two input exception interfaces have the same content
 */
function isSameException(ex1, ex2) {
  if (isOnlyOneTruthy(ex1, ex2)) return false;
  ex1 = ex1.values[0];
  ex2 = ex2.values[0];
  if (ex1.type !== ex2.type || ex1.value !== ex2.value) return false;
  return isSameStacktrace(ex1.stacktrace, ex2.stacktrace);
}

/**
 * Compare two objects for equality by checking all properties and values
 */
function isSameObject(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (obj1 == null && obj2 == null) return true; // eslint-disable-line eqeqeq
  if (isOnlyOneTruthy(obj1, obj2)) return false;
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (let i = 0; i < keys1.length; i++) {
    const key = keys1[i];
    if (!hasKey(obj2, key)) return false;
    if (obj1[key] !== obj2[key]) return false;
  }
  return true;
}

/**
 * Returns true if the two input stack trace interfaces have the same content
 */
function isSameStacktrace(stack1, stack2) {
  if (stack1 == null && stack2 == null) return true; // eslint-disable-line eqeqeq
  if (isOnlyOneTruthy(stack1, stack2)) return false;
  const frames1 = stack1.frames;
  const frames2 = stack2.frames;
  if (frames1 == null && frames2 == null) return isSameObject(stack1, stack2); // eslint-disable-line eqeqeq
  if (isOnlyOneTruthy(frames1, frames2)) return false;
  if (frames1.length == null && frames2.length == null)
    // eslint-disable-line eqeqeq
    return isSameObject(stack1, stack2);
  // Exit early if no frames or if frame count differs
  if (frames1.length !== frames2.length) return false;

  // Iterate through every frame; bail out if anything differs
  for (let i = 0; i < frames1.length; i++) {
    const a = frames1[i];
    const b = frames2[i];
    if (a.filename !== b.filename || a.lineno !== b.lineno || a.colno !== b.colno || a['function'] !== b['function']) return false;
  }
  return true;
}

/**
 * Polyfill a method
 * @param obj object e.g. `document`
 * @param name method name present on object e.g. `addEventListener`
 * @param replacement replacement function
 * @param track {optional} record instrumentation to an array
 */
function fill(obj, name, replacement, track) {
  const orig = obj[name];
  const replacementFn = replacement(orig);
  try {
    obj[name] = replacementFn;
  } catch (_e) {
    return;
  }
  if (track) {
    track.push([obj, name, orig]);
  }
}

/**
 * Redacts sensitive parameters from a URL
 * @param url - The URL to redact sensitive parameters from
 * @returns The URL with sensitive parameters redacted
 */
function redactSensitiveUrlParams(url) {
  if (!url || typeof url !== 'string') {
    return url;
  }
  try {
    // Parse the URL
    const parsedUrl = new URL(url);

    // Redact search params
    const searchParams = parsedUrl.searchParams;
    if (searchParams.has('otp')) {
      searchParams.set('otp', '**REDACTED**');
    }
    if (searchParams.has('otpId')) {
      searchParams.set('otpId', '**REDACTED**');
    }

    // Redact hash parameters
    if (parsedUrl.hash) {
      // Remove the leading # character
      const hashWithoutLeadingChar = parsedUrl.hash.substring(1);

      // Check if there are parameters in the hash
      if (hashWithoutLeadingChar.includes('=')) {
        // Replace the entire hash with redacted
        parsedUrl.hash = '**REDACTED**';
      }
    }
    return parsedUrl.toString();
  } catch (e) {
    // If URL parsing fails, return the original URL
    return url;
  }
}