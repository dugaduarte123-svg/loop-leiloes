"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runMetricsDaemon = runMetricsDaemon;
var _MetricsDaemon = require("./MetricsDaemon");
var _getGlobal = require("../getGlobal");
var _enviro = _interopRequireDefault(require("enviro"));
function runMetricsDaemon() {
  const daemonInstance = _MetricsDaemon.MetricsDaemon.instance();
  daemonInstance.run();
  const global = (0, _getGlobal.getGlobal)();
  if (!_enviro.default.deployed()) {
    global.flushMetricsJs = () => daemonInstance.flush();
  }
  return daemonInstance;
}