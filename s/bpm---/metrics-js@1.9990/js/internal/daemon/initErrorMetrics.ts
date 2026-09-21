"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMetricsFactoryForTesting = getMetricsFactoryForTesting;
exports.initErrorMetrics = initErrorMetrics;
exports.resetErrorTrackingForTesting = resetErrorTrackingForTesting;
var _MetricsFactory = require("../MetricsFactory");
var _getGlobal = require("../getGlobal");
let evtTarget = window;
let factory;
function setErrorMetricsSetupComplete(newValue) {
  (0, _getGlobal.getHubSpot)().__errorMetricsSetupComplete = newValue;
}
function getErrorMetricsSetupComplete() {
  return (0, _getGlobal.getHubSpot)().__errorMetricsSetupComplete;
}
function initErrorMetrics(customTarget) {
  // for testing - actually dispatching errors to the window during tests
  // causes the tests to fail
  evtTarget = customTarget || evtTarget;
  if (factory || getErrorMetricsSetupComplete()) {
    return;
  }

  // Only setup listeners once, otherwise we get multiple errors per asynchronously loaded bundle (Navigation, Zorse, etc).
  setErrorMetricsSetupComplete(true);

  // Need to construct a factory directly to avoid a circular dependency in
  // createMetricsFactory. Do not copy this into app/library code.
  // Final metric name: *.frontend.js.errors.count
  factory = new _MetricsFactory.MetricsFactory('js', {});

  // We need to initialize per-session metrics to 0, otherwise the metric
  // will not be reported if no errors occur in a session.
  factory[_MetricsFactory.$SessionCounter]('errors-per-session').increment(0);
  try {
    evtTarget.addEventListener('rejectionhandled', onHandledPromiseRejection);
    evtTarget.addEventListener('ravenSuccess', onRavenRequestSuccess);
    evtTarget.addEventListener('ravenFailure', onRavenRequestFailure);
    evtTarget.addEventListener('ravenCaptureIgnored', onRavenCaptureIgnored);
  } catch (__err) {
    // ignore, this is an unrecoverable failure
  }
}
function getMetricsFactoryForTesting() {
  return factory;
}
function resetErrorTrackingForTesting() {
  try {
    factory = undefined;
    if ((0, _getGlobal.getHubSpot)()) delete (0, _getGlobal.getHubSpot)().__errorMetricsSetupComplete;
  } catch (__err) {
    // ignore, this is an unrecoverable failure
  }
}
const EXTENSION_REGEX = /@<inline>|moz-extension:\/\/|chrome-extension:\/\/|safari-web-extension:\/\/|safari-extension:\/\//;
function isBrowserExtensionError(errObj) {
  if (errObj && errObj.stack && errObj.stack.match(EXTENSION_REGEX)) {
    if (factory) {
      factory.counter('browser-extension-errors').increment();
    }
    return true;
  }
  return false;
}
function getLibraryNameDimensions(tags) {
  const libraryName = tags === null || tags === void 0 ? void 0 : tags.library_name;
  if (typeof libraryName !== 'string' || libraryName.length === 0 || libraryName.length > 100) {
    return {};
  }
  return {
    library_name: libraryName
  };
}
function checkAndReportIfUnhandledPromisedRejection(evt, libraryDimensions) {
  if (!factory) return;
  if (evt.reason && isBrowserExtensionError(evt.reason)) {
    return;
  }
  const data = 'data' in evt ? evt.data : undefined;
  if (data && data.tags && data.tags.isUnhandledPromiseRejection) {
    factory.counter('unhandled-promise-rejection', libraryDimensions).increment();
  }
}
function onHandledPromiseRejection() {
  if (!factory) return;
  factory.counter('handled-promise-rejection').increment();
}
function onRavenRequestSuccess(errEvt) {
  if (!factory) return {};
  if ('project' in errEvt) return {};
  const data = 'data' in errEvt ? errEvt.data : undefined;

  // level may be undefined, that indicates a error-level report
  if (data && (data.level === 'error' || data.level == null)) {
    const libraryDimensions = getLibraryNameDimensions(data.tags);
    factory.counter('errors', libraryDimensions).increment();
    factory[_MetricsFactory.$SessionCounter]('errors-per-session', libraryDimensions).increment();

    // check for unhandled promise rejection events and record metrics accordingly.
    checkAndReportIfUnhandledPromisedRejection(errEvt, libraryDimensions);
    return libraryDimensions;
  }
  return {};
}
function onRavenRequestFailure(errEvt) {
  var _error$request$status, _error, _src;
  if (!factory) return;
  if ('project' in errEvt) return;

  // We still want to count the error metric even if the raven request fails.
  // Reuse the libraryDimensions computed there to avoid parsing the event twice.
  const libraryDimensions = onRavenRequestSuccess(errEvt);
  const statusCode = String((_error$request$status = (_error = errEvt.error) === null || _error === void 0 || (_error = _error.request) === null || _error === void 0 ? void 0 : _error.status) !== null && _error$request$status !== void 0 ? _error$request$status : 'unknown');
  const url = (_src = errEvt.src) !== null && _src !== void 0 ? _src : '';
  const reportType = url.includes('/frontend/observability/') ? 'page-event' : 'exception';
  factory.counter('raven-request-failure', Object.assign({
    statusCode,
    reportType
  }, libraryDimensions)).increment();
}
function onRavenCaptureIgnored(evt) {
  if (!factory) return;
  if ('project' in evt) return;

  // level always defined in ravenCaptureIgnored event
  if ('level' in evt && evt.level === 'error') {
    factory.counter('error-reports-ignored-by-configuration').increment();
  }
}