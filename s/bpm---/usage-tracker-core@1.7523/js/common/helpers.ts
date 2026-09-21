import { SENSITIVE_PROPERTIES } from '../constants';
// This defines a local safe reference to the global.Window object
// We use an exhaustion method approach, where we check on a priority-based
// approach to get the `global` context for the given environment
export const lWindow = function () {
  // eslint-disable-next-line
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line
    return window;
  }
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }

  // eslint-disable-next-line
  if (typeof self !== 'undefined') {
    // eslint-disable-next-line
    return self;
  }
  throw new Error('[usage-tracker-js] Unable to determine the global context');
}();
export const ensureFn = (fn, fallback = () => {}) => typeof fn === 'function' ? fn : fallback;
export const getObjectKeys = Object.keys;
export const isPromise = subject => Boolean(subject) && typeof subject === 'object' && typeof subject.then === 'function' || subject instanceof Promise;
export const promiseHasDone = promise => Boolean(promise) && typeof promise === 'object' && typeof promise.done === 'function';
export const reduceObject = obj => fn => getObjectKeys(obj).reduce(fn, {});
export const between = (str = '', left = '', right = '') => {
  const leftIndex = str.indexOf(left);
  const rightIndex = str.indexOf(right);
  return str.substr(leftIndex + left.length, rightIndex - leftIndex - right.length);
};

// Note this is a naive approach and should not be used outside this library
export const debounce = (fn, wait) => {
  let timeout = 0;
  let result;
  const debounced = (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      timeout = 0;
      result = fn.apply(null, args);
    }, wait);
    return result;
  };
  return debounced;
};
export const defaults = (source = {}, blueprint = {}) => {
  const withDefaults = reduceObject(blueprint)((accumulator, key) => {
    const value = source[key];
    if (value === undefined && blueprint[key] !== undefined) {
      accumulator[key] = blueprint[key];
    }
    return accumulator;
  });
  return Object.assign({}, source, withDefaults);
};
export const isArray = thing => {
  if ('isArray' in Array) {
    return Array.isArray(thing);
  }
  return Object.prototype.toString.call(thing) === '[object Array]';
};
export const getRealTypeOf = thing => {
  let type = typeof thing;
  if (isArray(thing)) {
    type = 'array';
  }
  if (thing === null) {
    return 'null';
  }
  return type;
};
export const makeUuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let v;
    const r = Math.random() * 16 | 0; // eslint-disable-line no-bitwise
    if (c === 'x') {
      v = r;
    } else {
      v = r & 0x3 | 0x8; // eslint-disable-line no-bitwise
    }
    return v.toString(16);
  });
};
export const mapObject = (source = {}, iteratee) => {
  return reduceObject(source)((accumulator, key) => {
    accumulator[key] = iteratee(key, source[key]);
    return accumulator;
  });
};
export const omit = (source = {}, list = []) => {
  return reduceObject(source || {})((accumulator, key) => {
    const includes = list.includes(key);
    if (!includes) {
      accumulator[key] = source[key];
    }
    return accumulator;
  });
};
export const pick = (source = {}, list = []) => Object.assign({}, ...list.map(key => ({
  [key]: source[key]
})));
export const once = fn => {
  let isCached;
  let result;
  return (...args) => {
    if (!isCached) {
      isCached = true;
      result = fn(...args);
    }
    return result;
  };
};
export const pluck = (subject, collection) => {
  // We cannot use reduceObject here since the return types are intriniscally different
  return getObjectKeys(collection).reduce((accumulator, key) => {
    const entry = collection[key];
    accumulator[key] = entry[subject];
    return accumulator;
  }, {});
};
export const trim = (str = '', outer = '') => {
  str = str.replace(/^\s+|\s+$/g, '');
  if (str.indexOf(outer) === 0) {
    str = str.substr(outer.length);
  }
  if (str.indexOf(outer) === str.length - outer.length) {
    str = str.substr(0, str.indexOf(outer));
  }
  return str;
};
export const shallowCopy = (source = {}) => {
  return reduceObject(source)((accumulator, key) => {
    accumulator[key] = source[key];
    return accumulator;
  });
};
export const truncate = (str = '', limit = 256) => {
  let truncated = str;
  if (truncated.length > limit) {
    truncated = truncated.substr(0, limit);
    truncated = `${truncated}[..]`;
  }
  return truncated;
};
export const createQueue = () => {
  const queue = [];
  return {
    enqueue: entry => queue.unshift(entry),
    dequeue: () => queue.shift(),
    peek: () => queue[0]
  };
};
export const safeGetOrDefault = (path = [], defaultValue, root = lWindow) => {
  let result = root;
  path.forEach(current => {
    const hasNode = result && current in result;
    result = hasNode ? result[current] : undefined;
  });
  return result === undefined ? defaultValue : result;
};
export const prettyPrint = (str = '') => {
  const snakeCase = str.toString().replace(/(?:^|\.?)([A-Z]+)/g, (x, y) => `_${y.toLowerCase()}`).replace(/^_/, '');
  const titleCase = snakeCase.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  return titleCase.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\s{2}/g, ' ');
};
export const convertEventNameToEventKey = (str = '') => str.replace(/[_|-]/g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => letter[index === 0 ? 'toLowerCase' : 'toUpperCase']()).replace(/\s+/g, '');
export const deepFreeze = source => {
  if (source && typeof source === 'object' && !Object.isFrozen(source)) {
    Object.freeze(source);
    Object.getOwnPropertyNames(source).forEach(prop => deepFreeze(source[prop]));
  }
  return source;
};
export const proxyLogger = tags => c => (m, e) => {
  const decoratedData = {
    fingerprint: ['usage-tracker-js'],
    tags
  };
  return ensureFn(c)(m, Object.assign({}, decoratedData, e));
};
export const mask = (properties, _mask = '**********') => properties.reduce((acc, key) => Object.assign({}, acc, {
  [key]: _mask
}), {});
export const maskEmail = input => input && typeof input === 'string' ? input.replace(/^(.{0})[^@]+/, '$1*****') : input;
export const replaceSentryValues = (input = {}) => {
  const sensitiveProps = Object.entries(pick(input, SENSITIVE_PROPERTIES)).filter(([, value]) => Boolean(value)).map(([key]) => key);
  const parsedValues = Object.entries(input).map(([k, v]) => [k, typeof v === 'function' ? 'Function' : v]).map(([k, v]) => [k, typeof v === 'undefined' ? null : v]);
  return Object.assign({}, Object.fromEntries(parsedValues), mask(sensitiveProps));
};
export const dispatchFunctionAsync = f => {
  // Makes a synchronous function non-blocking, in case we want to dispatch things
  // without waiting for the result or for their call to resolve
  // Errors are intentionally swallowed: this is a fire-and-forget helper,
  // and re-throwing inside .catch() creates unhandled promise rejections
  // (e.g. iOS Safari WeakMap TypeErrors from bundled polyfills).
  new Promise(resolve => resolve(f())).catch(() => {});
};

// Recursively binary-splits an array until each chunk's JSON.stringify()
// length fits within maxSize. Uses string length as a cheap proxy for byte
// size — safe for ASCII-heavy payloads with a caller-supplied safety margin
// below the hard 64 KiB sendBeacon / keepalive limit.
// A single item that already exceeds maxSize is returned as-is: splitting
// further would infinite-loop (mid === 0), so we bail out and let the
// caller's onFailure / safeGuard flow handle it as a best-effort send.
export const splitJsonArrayIntoChunks = (items, maxSize) => {
  if (items.length === 0) {
    return [];
  }
  if (items.length === 1 || JSON.stringify(items).length <= maxSize) {
    return [items];
  }
  const mid = Math.floor(items.length / 2);
  return [...splitJsonArrayIntoChunks(items.slice(0, mid), maxSize), ...splitJsonArrayIntoChunks(items.slice(mid), maxSize)];
};

// Better (and more modern) approach for getting the screen size
// this is used as a metaProperty for each Event
export const getScreenWidthSize = size => {
  if (size > 1280) {
    return 'xlarge (> 1280)';
  }
  if (size >= 1024) {
    return 'large (1024 - 1280)';
  }
  if (size >= 680) {
    return 'medium (680 - 1024)';
  }
  if (size > 0) {
    return 'small (< 680)';
  }
  return 'unknown';
};