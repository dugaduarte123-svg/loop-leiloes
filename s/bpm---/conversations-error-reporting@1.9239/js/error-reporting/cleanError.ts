const MAX_STRING_LENGTH = 2000;
const KEYS_TO_OMIT = new Set([
// added by IE
'number', 'description',
// added by safari
'line', 'column']);
const KEYS_NOT_TO_CLEAN = new Set(['graphQLErrors', 'networkError', 'error']);

// Acceptable properties to send to Sentry/New Relic

// Approach adapted from buildSafeStringifyWithCircularReferenceHandler in:
// https://github.com/HubSpotEngineering/mothership-task-runner/blob/40d0e9bfeabfd98eebbf0e50f322454f29a2ed24/invasion-worker-base/src/stdio-monkeypatch.ts#L54-L84
const trackReplaceCircularValues = (val, seen) => {
  // we don't want to track any non-objects, including nulls
  if (typeof val !== 'object' || val === null) {
    return val;
  }
  if (seen.has(val)) {
    return '[Circular]';
  }

  // val is a non-null object not yet visited — track it and serialize normally
  seen.add(val);
  return val;
};
const safeStringify = value => {
  const seen = new WeakSet();
  try {
    const json = JSON.stringify(value, (_key, val) => trackReplaceCircularValues(val, seen));
    const suffix = json.length > MAX_STRING_LENGTH ? '...' : '';
    return `${json.substr(0, MAX_STRING_LENGTH)}${suffix}`;
  } catch (_unused) {
    return '/* Object removed due to error stringifying */';
  }
};
const cleanProperty = value => {
  switch (typeof value) {
    case 'boolean':
    case 'number':
      {
        return value;
      }
    case 'string':
      {
        const suffix = value.length > MAX_STRING_LENGTH ? '...' : '';
        return `${value.substr(0, MAX_STRING_LENGTH)}${suffix}`;
      }
    case 'function':
      {
        return 'function() { /* Function removed */ }';
      }
    case 'object':
      {
        if (value === null) {
          return value;
        } else {
          return '/* Object, Error, or Array removed */';
        }
      }
    default:
      return undefined;
  }
};
export const cleanError = (error, maybeKeys) => {
  if (!error) {
    return null;
  }
  const allKeys = Array.isArray(maybeKeys) ? maybeKeys : Object.getOwnPropertyNames(error);
  const keys = allKeys.filter(key => !KEYS_TO_OMIT.has(key));
  if (keys.length === 0) {
    return null;
  }
  return keys.reduce((acc, key) => {
    let errorProperty = error[key];
    if (KEYS_NOT_TO_CLEAN.has(key) && errorProperty !== undefined) {
      errorProperty = safeStringify(errorProperty);
    }
    const property = cleanProperty(errorProperty);
    if (property !== undefined) acc[key] = property;
    return acc;
  }, {});
};