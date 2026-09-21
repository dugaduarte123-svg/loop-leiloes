"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMetricsFactoryForTesting = getMetricsFactoryForTesting;
exports.initSpeculationRules = initSpeculationRules;
exports.resetSpeculationRulesForTesting = resetSpeculationRulesForTesting;
var _getGlobal = require("../getGlobal");
var _MetricsFactory = require("../MetricsFactory");
let evtTarget = window;
let factory;
function setSpeculationSetupComplete(newValue) {
  (0, _getGlobal.getHubSpot)().__speculationSetupComplete = newValue;
}
function getSpeculationSetupComplete() {
  return (0, _getGlobal.getHubSpot)().__speculationSetupComplete;
}
function initSpeculationRules(customTarget) {
  var _evtTarget;
  // for testing - actually dispatching errors to the window during tests
  // causes the tests to fail
  evtTarget = customTarget || evtTarget;
  if (factory || getSpeculationSetupComplete() ||
  // @ts-ignore prerendering is experimental, only in Chromium
  ((_evtTarget = evtTarget) === null || _evtTarget === void 0 || (_evtTarget = _evtTarget.document) === null || _evtTarget === void 0 ? void 0 : _evtTarget.prerendering) === undefined) {
    return;
  }

  // Only setup listeners once, otherwise we get multiple errors per asynchronously loaded bundle (Navigation, Zorse, etc).
  setSpeculationSetupComplete(true);

  // Need to construct a factory directly to avoid a circular dependency in
  // createMetricsFactory. Do not copy this into app/library code.
  factory = new _MetricsFactory.MetricsFactory('js', {
    name: 'speculationrules'
  });
  try {
    var _evtTarget2, _evtTarget3, _evtTarget3$getEntrie;
    if (
    // @ts-ignore prerendering is experimental, only in Chromium
    (_evtTarget2 = evtTarget) !== null && _evtTarget2 !== void 0 && (_evtTarget2 = _evtTarget2.document) !== null && _evtTarget2 !== void 0 && _evtTarget2.prerendering || // @ts-ignore activationStart is part of Speculation Rules API, only in Chromium
    (_evtTarget3 = evtTarget) !== null && _evtTarget3 !== void 0 && (_evtTarget3 = _evtTarget3.performance) !== null && _evtTarget3 !== void 0 && (_evtTarget3$getEntrie = _evtTarget3.getEntriesByType) !== null && _evtTarget3$getEntrie !== void 0 && (_evtTarget3$getEntrie = _evtTarget3$getEntrie.call(_evtTarget3, 'navigation')[0]) !== null && _evtTarget3$getEntrie !== void 0 && _evtTarget3$getEntrie.activationStart) {
      var _evtTarget4;
      // @ts-ignore activationStart is part of Speculation Rules API, only in Chromium
      (_evtTarget4 = evtTarget) === null || _evtTarget4 === void 0 || (_evtTarget4 = _evtTarget4.document) === null || _evtTarget4 === void 0 || _evtTarget4.addEventListener('prerenderingchange', trackPrerenderingTime, {
        once: true
      });
      factory.counter('prerendering').increment();
    }
  } catch (__err) {
    // ignore
  }
}
function getMetricsFactoryForTesting() {
  return factory;
}
function resetSpeculationRulesForTesting() {
  try {
    factory = undefined;
    if ((0, _getGlobal.getHubSpot)()) delete (0, _getGlobal.getHubSpot)().__speculationSetupComplete;
  } catch (__err) {
    // ignore, this is an unrecoverable failure
  }
}
function trackPrerenderingTime() {
  var _evtTarget5, _evtTarget5$getEntrie;
  if (!factory) return;
  const activationStart = // @ts-ignore activationStart is part of Speculation Rules API, only in Chromium
  (_evtTarget5 = evtTarget) === null || _evtTarget5 === void 0 || (_evtTarget5 = _evtTarget5.performance) === null || _evtTarget5 === void 0 || (_evtTarget5$getEntrie = _evtTarget5.getEntriesByType) === null || _evtTarget5$getEntrie === void 0 || (_evtTarget5$getEntrie = _evtTarget5$getEntrie.call(_evtTarget5, 'navigation')[0]) === null || _evtTarget5$getEntrie === void 0 ? void 0 : _evtTarget5$getEntrie.activationStart;
  if (activationStart && activationStart > 0) {
    factory.histogram('activationStart').update(activationStart);
    factory.counter('prerendered-activation-start', {
      activationStart: 'nonzero'
    }).increment();
  } else {
    factory.counter('prerendered-activation-start', {
      activationStart: 'zero'
    }).increment();
  }
}