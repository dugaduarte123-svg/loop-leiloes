"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configure;
exports.reconfigure = reconfigure;
var _enviro = _interopRequireDefault(require("enviro"));
var _PortalIdParser = _interopRequireDefault(require("PortalIdParser"));
var _ravenJs = _interopRequireDefault(require("raven-js"));
var _hubspot = _interopRequireDefault(require("hubspot"));
var _getDeployInfo = require("./utils/getDeployInfo");
// @ts-expect-error untyped module

// 200KiB
const MAX_MSG_CHARS = 200 * 1000;
function getSeleniumCookieValue() {
  try {
    if (!(document && document.cookie)) {
      return undefined;
    }
    const match = document.cookie.match(/hs_selenium=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : undefined;
  } catch (__err) {
    return undefined;
  }
}
function getDataCallback(origDataCallback, explicitSeleniumCookie) {
  return function dataCallback(data) {
    if (origDataCallback) {
      data = origDataCallback(data);
    }
    try {
      const jsonString = JSON.stringify(data.extra);
      if (jsonString.length > MAX_MSG_CHARS) {
        if (_enviro.default.debug('sentry')) {
          console.error(`Excessively large message logged to Raven (${jsonString.length} characters). The extra data is logged here but will not be sent to Sentry.`, data.extra);
        }
        data.extra = {
          message: 'Error processing Sentry (extra data more than 200kb stringified). Existing extra data removed.'
        };
      }
    } catch (err) {
      // Failed to stringify JSON, report unserializable object problem.
      if (_enviro.default.debug('sentry')) {
        console.error('An unserializable object was logged to Raven as `extra` data. The extra data is logged here but will not be sent to Sentry.', data.extra);
      }
      data.extra = {
        message: 'Error processing Sentry (extra data not serializable). Existing extra data removed.',
        originalMessage: err.message
      };
    }
    const seleniumCookieValue = explicitSeleniumCookie !== null && explicitSeleniumCookie !== void 0 ? explicitSeleniumCookie : getSeleniumCookieValue();
    if (seleniumCookieValue) {
      data.extra = data.extra || {};
      data.extra.seleniumCookie = seleniumCookieValue;
    }
    return data;
  };
}
let baseIgnoreErrors = [];
let baseIgnoreUrls = [];
function configure(dsn, options = {}) {
  if (typeof _hubspot.default.bender === 'undefined' && _enviro.default.getShort('sentry') !== 'prod') {
    console.warn('[raven-hubspot] `project` and `release` Sentry tags will not be set. See: HubSpot/raven-hubspot/issues/40');
  }
  const {
    bender
  } = _hubspot.default;
  const defaultOptions = {
    sampleRate: 1,
    // The `stacktrace` option enables stack traces for captureMessage calls
    stacktrace: true,
    ignoreErrors: ['Aborting: redirection in progress', /Aborting: notifying parents of unauthorized response/, /Cannot set property 'install' of undefined/, /ResizeObserver loop completed with undelivered notifications/, /ResizeObserver loop limit exceeded/, /'URLSearchParams' is not defined/, /Not implemented on this platform/, /Object Not Found Matching Id/i],
    ignoreUrls: []
  };
  const providedErrorsToIgnore = options.ignoreErrors || [];
  const mergedOptions = Object.assign({}, defaultOptions, options, {
    ignoreErrors: [...defaultOptions.ignoreErrors, ...providedErrorsToIgnore]
  });
  baseIgnoreErrors = mergedOptions.ignoreErrors;
  baseIgnoreUrls = mergedOptions.ignoreUrls;
  const env = _enviro.default.getShort('sentry');
  let isAcceptanceTest;
  try {
    isAcceptanceTest = !!(document && document.cookie && document.cookie.includes('hs_selenium'));
  } catch (__err) {
    isAcceptanceTest = false;
  }
  const deployInfo = (0, _getDeployInfo.getDeployInfo)();

  // HACK deploy info is not available locally or on infra apps
  // right now, so we fallback to the bender project. Technically
  // the bender project isn't always the same, but this is the case
  // for most apps. Tracking fixes for this here:
  // https://git.hubteam.com/HubSpot/faas-reliability-ideas/issues/496
  const project = deployInfo ? deployInfo.deployable : bender && bender.currentProject;
  const release = bender && bender.currentProjectVersion;
  _ravenJs.default.config(dsn, {
    release,
    ignoreErrors: mergedOptions.ignoreErrors,
    ignoreUrls: mergedOptions.ignoreUrls,
    sampleRate: mergedOptions.sampleRate,
    environment: env,
    tags: Object.assign({
      env,
      project,
      portalId: _PortalIdParser.default.get({
        preserveGlobalId: true
      }),
      hublet: _enviro.default.getHublet(),
      isAcceptanceTest
    }, mergedOptions.tags),
    breadcrumbCallback: mergedOptions.breadcrumbCallback || (crumb => crumb),
    autoBreadcrumbs: {
      console: false
    },
    dataCallback: getDataCallback(mergedOptions.dataCallback, mergedOptions.seleniumCookie),
    shouldSendCallback: mergedOptions.shouldSendCallback || (() => true),
    stacktrace: mergedOptions.stacktrace
  }).install();
  if (_enviro.default.debug('sentry') || !_enviro.default.deployed('sentry')) {
    // According to the docs (https://docs.sentry.io/clients/javascript/config/) `debug` is
    // a valid option but it doesn't seems to work in the version of `raven-js` that we have
    // repackaged. Setting this property works for now.
    _ravenJs.default.debug = true;
  }
  if (!_enviro.default.deployed('sentry')) {
    // If not deployed we still want to configure Raven and allow local testing. This
    // would be more appropriate as a NODE_ENV check when available.
    _ravenJs.default.setTransport(({
      onSuccess
    }) => {
      onSuccess();
    });
  }
}
function reconfigure({
  project,
  release,
  ignoreErrors,
  ignoreUrls
}) {
  if (project) {
    _ravenJs.default.setTagsContext({
      project
    });
  }
  if (release) {
    _ravenJs.default.setRelease(release);
  }
  if (ignoreErrors) {
    _ravenJs.default.setIgnoreErrors([...baseIgnoreErrors, ...ignoreErrors]);
  }
  if (ignoreUrls) {
    _ravenJs.default.setIgnoreUrls([...baseIgnoreUrls, ...ignoreUrls]);
  }
}
const origSetInterval = window.setInterval;
window.setInterval = function setIntervalWrapped(fn, ...rest) {
  if (typeof fn !== 'function') {
    _ravenJs.default.captureException(new Error('Implied eval. Only a function should be passed as first arg of setInterval.'));
  }
  return origSetInterval(fn, ...rest);
};
const origSetTimeout = window.setTimeout;
window.setTimeout = function setTimeoutWrapped(fn, ...rest) {
  if (typeof fn !== 'function') {
    _ravenJs.default.captureException(new Error('Implied eval. Only a function should be passed as first arg of setTimeout.'));
  }
  return origSetTimeout(fn, ...rest);
};