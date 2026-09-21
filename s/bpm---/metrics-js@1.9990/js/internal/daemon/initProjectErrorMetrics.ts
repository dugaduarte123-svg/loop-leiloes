"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initProjectErrorMetrics = initProjectErrorMetrics;
exports.resetProjectErrorMetricsForTesting = resetProjectErrorMetricsForTesting;
var _MetricsFactory = require("../MetricsFactory");
const initializedProjects = new Map();
function initProjectErrorMetrics(projectName, customTarget) {
  if (initializedProjects.has(projectName)) {
    return;
  }
  const target = customTarget || window;
  const factory = new _MetricsFactory.MetricsFactory(projectName, {});
  initializedProjects.set(projectName, factory);
  factory[_MetricsFactory.$SessionCounter]('errors-per-session').increment(0);
  try {
    target.addEventListener('ravenSuccess', evt => onRavenRequestSuccess(factory, evt, projectName));
    target.addEventListener('ravenFailure', evt => onRavenRequestFailure(factory, evt, projectName));
    target.addEventListener('ravenCaptureIgnored', evt => onRavenCaptureIgnored(factory, evt, projectName));
  } catch (__err) {
    // ignore, this is an unrecoverable failure
  }
}
function resetProjectErrorMetricsForTesting(projectName) {
  initializedProjects.delete(projectName);
}
function isProjectEvent(evt, projectName) {
  return 'project' in evt && evt.project === projectName;
}
function onRavenRequestSuccess(factory, errEvt, projectName) {
  if (initializedProjects.get(projectName) !== factory) return;
  if (!isProjectEvent(errEvt, projectName)) return;
  const data = 'data' in errEvt ? errEvt.data : undefined;
  if (data && (data.level === 'error' || data.level == null)) {
    factory.counter('errors').increment();
    factory[_MetricsFactory.$SessionCounter]('errors-per-session').increment();
    if (data.tags && data.tags.isUnhandledPromiseRejection) {
      factory.counter('unhandled-promise-rejection').increment();
    }
  }
}
function onRavenRequestFailure(factory, errEvt, projectName) {
  var _error$request$status, _error, _src;
  if (initializedProjects.get(projectName) !== factory) return;
  if (!isProjectEvent(errEvt, projectName)) return;
  onRavenRequestSuccess(factory, errEvt, projectName);
  const statusCode = String((_error$request$status = (_error = errEvt.error) === null || _error === void 0 || (_error = _error.request) === null || _error === void 0 ? void 0 : _error.status) !== null && _error$request$status !== void 0 ? _error$request$status : 'unknown');
  const url = (_src = errEvt.src) !== null && _src !== void 0 ? _src : '';
  const reportType = url.includes('/frontend/observability/') ? 'page-event' : 'exception';
  factory.counter('raven-request-failure', {
    statusCode,
    reportType
  }).increment();
}
function onRavenCaptureIgnored(factory, evt, projectName) {
  if (initializedProjects.get(projectName) !== factory) return;
  if (!isProjectEvent(evt, projectName)) return;
  if ('level' in evt && evt.level === 'error') {
    factory.counter('error-reports-ignored-by-configuration').increment();
  }
}