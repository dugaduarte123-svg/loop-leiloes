/**
 * Enforces a single instance of the Raven client, and the
 * main entry point for Raven. If you are a consumer of the
 * Raven library, you SHOULD load this file (vs raven.js).
 **/

var {
    Raven: RavenConstructor
} = require('./raven');

// This is to be defensive in environments where window does not exist (see https://github.com/getsentry/raven-js/pull/785)
var _window =
    typeof window !== 'undefined' ?
    window :
    typeof global !== 'undefined' ?
    global :
    typeof self !== 'undefined' ?
    self :
    {};
var _Raven = _window.Raven;

var Raven = new RavenConstructor();

/*
 * Allow multiple versions of Raven to be installed.
 * Strip Raven from the global context and returns the instance.
 *
 * @return {Raven}
 */
Raven.noConflict = function() {
    _window.Raven = _Raven;
    return Raven;
};

Raven.afterLoad();

/**
 * Export public API methods bound to Raven so
 * they'll work if imported via named imports
 */
module.exports.config = Raven.config.bind(Raven);
module.exports.install = Raven.install.bind(Raven);
module.exports.setDSN = Raven.setDSN.bind(Raven);
module.exports.context = Raven.context.bind(Raven);
module.exports.wrap = Raven.wrap.bind(Raven);
module.exports.uninstall = Raven.uninstall.bind(Raven);
module.exports.capturePageEvent = Raven.capturePageEvent.bind(Raven);
module.exports.captureException = Raven.captureException.bind(Raven);
module.exports.captureMessage = Raven.captureMessage.bind(Raven);
module.exports.captureBreadcrumb = Raven.captureBreadcrumb.bind(Raven);
module.exports.addPlugin = Raven.addPlugin.bind(Raven);
module.exports.setUserContext = Raven.setUserContext.bind(Raven);
module.exports.setExtraContext = Raven.setExtraContext.bind(Raven);
module.exports.setTagsContext = Raven.setTagsContext.bind(Raven);
module.exports.clearContext = Raven.clearContext.bind(Raven);
module.exports.getContext = Raven.getContext.bind(Raven);
module.exports.setEnvironment = Raven.setEnvironment.bind(Raven);
module.exports.setRelease = Raven.setRelease.bind(Raven);
module.exports.setDataCallback = Raven.setDataCallback.bind(Raven);
module.exports.setBreadcrumbCallback = Raven.setBreadcrumbCallback.bind(Raven);
module.exports.setShouldSendCallback = Raven.setShouldSendCallback.bind(Raven);
module.exports.setTransport = Raven.setTransport.bind(Raven);
module.exports.lastException = Raven.lastException.bind(Raven);
module.exports.lastEventId = Raven.lastEventId.bind(Raven);
module.exports.isSetup = Raven.isSetup.bind(Raven);
module.exports.afterLoad = Raven.afterLoad.bind(Raven);
module.exports.showReportDialog = Raven.showReportDialog.bind(Raven);

module.exports = Raven;