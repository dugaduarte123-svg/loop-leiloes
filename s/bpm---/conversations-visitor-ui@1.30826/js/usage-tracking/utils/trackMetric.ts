import { createMetricsFactory } from 'metrics-js';
export const Metrics = createMetricsFactory('conversations-visitor-ui');

/**
 * Detects the browser being used by the visitor.
 * Warning: This should not be used for anything except metrics tracking
 * as it can be unreliable and easily spoofed.
 */
function detectBrowser() {
  const userAgent = navigator.userAgent;
  if (/Edge\/\d+/.test(userAgent)) {
    return 'Edge';
  } else if (/OPR\/\d+/.test(userAgent) || /Opera/.test(userAgent)) {
    return 'Opera';
  } else if (/Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor)) {
    return 'Chrome';
  } else if (/Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor)) {
    return 'Safari';
  } else if (/Firefox\/\d+/.test(userAgent)) {
    return 'Firefox';
  } else if (/MSIE \d|Trident\/\d/.test(userAgent)) {
    return 'Internet Explorer';
  } else {
    return 'Unknown';
  }
}
export const setGlobalDimension = (key, value) => {
  Metrics.globalDimensions = Object.assign({}, Metrics.globalDimensions, {
    [key]: value,
    browser: detectBrowser()
  });
};
export const trackPageViewMetric = () => {
  Metrics.counter('page-view').increment();
};
export const trackMessageSentMetric = () => {
  Metrics.counter('message-sent').increment();
};
export const trackThreadCreatedMetric = () => {
  Metrics.counter('thread-created').increment();
};
export const trackEmbedScriptPerfAttributes = data => {
  Metrics.histogram('embed-script-perf', data);
};
export const trackOnReadyUsed = () => {
  Metrics.counter('on-ready-used').increment();
};
export const trackSettingsUsed = () => {
  Metrics.counter('settings-used').increment();
};
export const trackApiMethodUsed = method => {
  Metrics.counter('api-method-used', {
    method
  });
};
export const trackApiEventListenerRegistered = event => {
  Metrics.counter('api-event-listener-registered', {
    event
  });
};
export const trackComposerDisabled = (reason, surface) => {
  Metrics.counter('composer-disabled', {
    reason,
    surface
  }).increment();
};