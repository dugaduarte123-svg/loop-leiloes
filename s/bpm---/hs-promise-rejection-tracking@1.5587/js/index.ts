"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.namePromise = exports.enableRejectionTracking = exports.disableRejectionTracking = void 0;
var _uuid = require("./utils/uuid");
/* hs-eslint ignored failing-rules */
/* eslint-disable hubspot-dev/no-declarations */

let enabled = false;
const MAX_VALUE_LENGTH = 1000;
const CAPTURED_KEYS = ['message', 'status', 'correlationId'];
const typeOfReason = reason => {
  return reason === null ? 'Null' : reason === undefined ? 'Undefined' : Object.prototype.toString.call(reason).slice(8, -1);
};
const safeStringify = value => {
  try {
    // Return strings as-is to avoid adding quotes
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
  } catch (e) {
    // Handle circular reference or other JSON.stringify errors
    return '[Unserializable]';
  }
};
const extractReasonValues = reason => {
  const extracted = {};
  if (reason == null) return extracted;

  // For Error objects, try to get message even if not enumerable
  if (reason instanceof Error && reason.message) {
    extracted.reasonMessage = reason.message.slice(0, MAX_VALUE_LENGTH);
  }

  // Extract values for captured keys
  for (const key of CAPTURED_KEYS) {
    const extractedKey = `reason${key.charAt(0).toUpperCase()}${key.slice(1)}`;
    // Skip if already extracted (e.g., Error.message)
    if (extractedKey in extracted) continue;
    if (key in reason && reason[key] !== undefined) {
      const value = safeStringify(reason[key]);
      extracted[extractedKey] = value.slice(0, MAX_VALUE_LENGTH);
    }
  }
  return extracted;
};
const sendAlerts = reason => {
  const Raven = require('raven-js');
  const unhandledRejectionUuid = (0, _uuid.getUniqueKey)();
  const reasonType = typeOfReason(reason);

  // Only extract values from object types, not primitives
  const extractedValues = typeof reason === 'object' && reason !== null ? extractReasonValues(reason) : {};
  const ravenOpts = {
    tags: {
      isUnhandledPromiseRejection: true,
      unhandledRejectionUuid,
      typeOfReason: reasonType
    },
    extra: Object.assign({}, typeof reason !== 'string' && reason != null && {
      reasonObjKeys: Object.keys(reason).join()
    }, extractedValues)
  };
  if (typeof reason === 'string') {
    Raven.captureMessage(reason, ravenOpts);
  } else {
    Raven.captureException(reason, ravenOpts);
  }
};
const isObject = it => {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
const DEBUG_NAME_KEY = '__debugName';
const handleUnhandledRejection = e => {
  e.preventDefault();
  if (isObject(e.promise)) {
    const debugName = e.promise[DEBUG_NAME_KEY];
    if (debugName) {
      console.error(`Unhandled Promise Rejection [${debugName}]`, e.reason);
    } else {
      console.error('Unhandled Promise Rejection', e.reason);
    }
    sendAlerts(e.reason);
  }
};
const disableRejectionTracking = () => {
  enabled = false;
  window.removeEventListener('unhandledrejection', handleUnhandledRejection);
};
exports.disableRejectionTracking = disableRejectionTracking;
const enableRejectionTracking = () => {
  if (enabled) {
    disableRejectionTracking();
  }
  enabled = true;
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
};
exports.enableRejectionTracking = enableRejectionTracking;
const namePromise = (promise, name) => {
  promise[DEBUG_NAME_KEY] = name;
  return promise;
};
exports.namePromise = namePromise;