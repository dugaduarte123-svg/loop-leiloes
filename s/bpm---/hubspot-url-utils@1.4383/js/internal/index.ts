"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDomain = getDomain;
exports.getDomainPrefix = getDomainPrefix;
exports.getEnvPostfix = getEnvPostfix;
exports.getHubletDomainPostfix = getHubletDomainPostfix;
exports.getHubletPostfix = getHubletPostfix;
exports.getPathPrefix = getPathPrefix;
exports.getSubDomain = getSubDomain;
exports.getTld = getTld;
var _enviro = _interopRequireDefault(require("enviro"));
var PureUrlUtils = _interopRequireWildcard(require("./pure-url-utils"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function getHubletToUse(overrideConfig) {
  return overrideConfig && overrideConfig.hubletOverride ? overrideConfig.hubletOverride : _enviro.default.getHublet();
}
function getEnvToUse(overrideConfig) {
  return overrideConfig && overrideConfig.envOverride ? overrideConfig.envOverride : _enviro.default.getShort();
}
function getHubletPostfix(overrideConfig) {
  const hubletToUse = getHubletToUse(overrideConfig);
  return PureUrlUtils.getHubletPostfix(hubletToUse, overrideConfig);
}
function getSubDomain(prefix, overrideConfig) {
  const hubletToUse = getHubletToUse(overrideConfig);
  return PureUrlUtils.getSubDomain(hubletToUse, prefix, overrideConfig);
}
function getDomain(overrideConfig) {
  const hublet = getHubletToUse(overrideConfig);
  const short = getEnvToUse(overrideConfig);
  return PureUrlUtils.getDomain(hublet, short, overrideConfig);
}
function getEnvPostfix(overrideConfig) {
  const envToUse = getEnvToUse(overrideConfig);
  return PureUrlUtils.getEnvPostfix(envToUse, overrideConfig);
}
function getDomainPrefix(overrideConfig) {
  return PureUrlUtils.getDomainPrefix(overrideConfig);
}
function getHubletDomainPostfix(overrideConfig) {
  const hubletToUse = getHubletToUse(overrideConfig);
  return PureUrlUtils.getHubletDomainPostfix(hubletToUse, overrideConfig);
}
function getTld(overrideConfig) {
  return PureUrlUtils.getTld(overrideConfig);
}
function getPathPrefix(subDomainPrefix) {
  return PureUrlUtils.getPathPrefix(subDomainPrefix);
}