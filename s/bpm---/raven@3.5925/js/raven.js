/*global XDomainRequest:false */

import htmlTreeAsString from './utils/htmlTreeAsString';
import {
    redactSensitiveUrlParams,
    isError,
    isObject,
    isErrorEvent,
    isUndefined,
    isFunction,
    isString,
    isEmptyObject,
    each,
    objectMerge,
    truncate,
    hasKey,
    joinRegExp,
    urlencode,
    uuid4,
    isSameException,
    isSameStacktrace,
    parseUrl,
    fill,
} from './utils';
import RavenConfigError from './configError';
import {
    wrapMethod as wrapConsoleMethod
} from './console';

var TraceKit = require('./vendor/TraceKit.js');
var stringify = require('./vendor/json-stringify-safe.js');
var {
    getCorrelationIdFromResponse,
    getCorrelationIdFromXHR,
} = require('./utils/getCorrelationId');

var dsnKeys = 'source protocol user pass host port path'.split(' '),
    dsnPattern = /^(?:(\w+):)?\/\/(?:(\w+)(:\w+)?@)?([\w\.-]+)(?::(\d+))?(\/.*)/;

function now() {
    return +new Date();
}

// This is to be defensive in environments where window does not exist (see https://github.com/getsentry/raven-js/pull/785)
var _window =
    typeof window !== 'undefined' ?
    window :
    typeof global !== 'undefined' ?
    global :
    typeof self !== 'undefined' ?
    self :
    {};
var _document = _window.document;
var _navigator = _window.navigator;

function keepOriginalCallback(original, callback) {
    return isFunction(callback) ?
        function(data) {
            return callback(data, original);
        } :
        callback;
}

// First, check for JSON support
// If there is no JSON, we no-op the core features of Raven
// since JSON is required to encode the payload
export function Raven() {
    this._hasJSON = !!(typeof JSON === 'object' && JSON.stringify);
    // Raven can run in contexts where there's no document (react-native)
    this._hasDocument = !isUndefined(_document);
    this._hasNavigator = !isUndefined(_navigator);
    this._lastCapturedException = null;
    this._lastData = null;
    this._lastEventId = null;
    this._globalServer = null;
    this._globalKey = null;
    this._globalProject = null;
    this._globalContext = {};
    this._globalOptions = {
        logger: 'javascript',
        ignoreErrors: [],
        ignoreUrls: [],
        whitelistUrls: [],
        includePaths: [],
        collectWindowErrors: true,
        maxMessageLength: 0,

        // By default, truncates URL values to 250 chars
        maxUrlLength: 250,
        stackTraceLimit: 50,
        autoBreadcrumbs: true,
        instrument: true,
        sampleRate: 1,

        // CHIRP error enhancement configuration
        chirpErrorEnhancement: {
            enabled: true,
            extractServiceInfo: true,
            enhanceErrorMessages: true,
            includeCallStack: true,
            maxNestingDepth: 5,
        },
    };
    this._ignoreOnError = 0;
    this._isRavenInstalled = false;
    this._originalErrorStackTraceLimit = Error.stackTraceLimit;
    // capture references to window.console *and* all its methods first
    // before the console plugin has a chance to monkey patch
    this._originalConsole = _window.console || {};
    this._originalConsoleMethods = {};
    this._plugins = [];
    this._startTime = now();
    this._wrappedBuiltIns = [];
    this._breadcrumbs = [];
    this._lastCapturedEvent = null;
    this._keypressTimeout;
    this._location = _window.location;
    this._lastHref = this._location && this._location.href;
    this._resetBackoff();

    // eslint-disable-next-line guard-for-in
    for (var method in this._originalConsole) {
        this._originalConsoleMethods[method] = this._originalConsole[method];
    }
}

/*
 * The core Raven singleton
 *
 * @this {Raven}
 */

Raven.prototype = {
    // Hardcode version string so that raven source can be loaded directly via
    // webpack (using a build step causes webpack #1617). Grunt verifies that
    // this value matches package.json during build.
    //   See: https://github.com/getsentry/raven-js/issues/465
    VERSION: '3.19.1',

    debug: false,

    TraceKit: TraceKit, // alias to TraceKit

    /*
     * Configure Raven with a DSN and extra options
     *
     * @param {string} dsn The public Sentry DSN
     * @param {object} options Set of global options [optional]
     * @return {Raven}
     */
    config: function(dsn, options) {
        var self = this;

        if (self._globalServer) {
            this._logDebug('error', 'Error: Raven has already been configured');
            return self;
        }
        if (!dsn) return self;

        var globalOptions = self._globalOptions;

        // merge in options
        if (options) {
            each(options, function(key, value) {
                // tags and extra are special and need to be put into context
                if (key === 'tags' || key === 'extra' || key === 'user') {
                    self._globalContext[key] = value;
                } else {
                    globalOptions[key] = value;
                }
            });
        }

        self.setDSN(dsn);

        // "Script error." is hard coded into browsers for errors that it can't read.
        // this is the result of a script being pulled in from an external domain and CORS.
        globalOptions.ignoreErrors.push(/^Script error\.?$/);
        globalOptions.ignoreErrors.push(
            /^Javascript error: Script error\.? on line 0$/
        );

        // join regexp rules into one big rule
        globalOptions.ignoreErrors = joinRegExp(globalOptions.ignoreErrors);
        globalOptions.ignoreUrls = globalOptions.ignoreUrls.length ?
            joinRegExp(globalOptions.ignoreUrls) :
            false;
        globalOptions.whitelistUrls = globalOptions.whitelistUrls.length ?
            joinRegExp(globalOptions.whitelistUrls) :
            false;
        globalOptions.includePaths = joinRegExp(globalOptions.includePaths);
        globalOptions.maxBreadcrumbs = Math.max(
            0,
            Math.min(globalOptions.maxBreadcrumbs || 100, 100)
        ); // default and hard limit is 100

        var autoBreadcrumbDefaults = {
            xhr: true,
            console: true,
            dom: true,
            location: true,
        };

        var autoBreadcrumbs = globalOptions.autoBreadcrumbs;
        if ({}.toString.call(autoBreadcrumbs) === '[object Object]') {
            autoBreadcrumbs = objectMerge(autoBreadcrumbDefaults, autoBreadcrumbs);
        } else if (autoBreadcrumbs !== false) {
            autoBreadcrumbs = autoBreadcrumbDefaults;
        }
        globalOptions.autoBreadcrumbs = autoBreadcrumbs;

        var instrumentDefaults = {
            tryCatch: true,
        };

        var instrument = globalOptions.instrument;
        if ({}.toString.call(instrument) === '[object Object]') {
            instrument = objectMerge(instrumentDefaults, instrument);
        } else if (instrument !== false) {
            instrument = instrumentDefaults;
        }
        globalOptions.instrument = instrument;

        TraceKit.collectWindowErrors = !!globalOptions.collectWindowErrors;

        // return for chaining
        return self;
    },

    /*
     * Installs a global window.onerror error handler
     * to capture and report uncaught exceptions.
     * At this point, install() is required to be called due
     * to the way TraceKit is set up.
     *
     * @return {Raven}
     */
    install: function() {
        var self = this;
        if (self.isSetup() && !self._isRavenInstalled) {
            TraceKit.report.subscribe(function() {
                self._handleOnErrorStackInfo.apply(self, arguments);
            });
            if (
                self._globalOptions.instrument &&
                self._globalOptions.instrument.tryCatch
            ) {
                self._instrumentTryCatch();
            }

            if (self._globalOptions.autoBreadcrumbs) self._instrumentBreadcrumbs();

            // Install all of the plugins
            self._drainPlugins();

            self._isRavenInstalled = true;
        }

        Error.stackTraceLimit = self._globalOptions.stackTraceLimit;
        return this;
    },

    /*
     * Set the DSN (can be called multiple time unlike config)
     *
     * @param {string} dsn The public Sentry DSN
     */
    setDSN: function(dsn) {
        var self = this,
            uri = self._parseDSN(dsn),
            lastSlash = uri.path.lastIndexOf('/'),
            path = uri.path.substr(1, lastSlash);

        self._dsn = dsn;
        self._globalKey = uri.user;
        self._globalSecret = uri.pass && uri.pass.substr(1);
        self._globalProject = uri.path.substr(lastSlash + 1);

        self._globalServer = self._getGlobalServer(uri);

        self._globalEndpoint =
            self._globalServer +
            '/' +
            path +
            'api/' +
            self._globalProject +
            '/store/';

        self._globalPageEventEndpoint =
            self._globalServer + '/frontend/observability/page-tracking/store/';

        // Reset backoff state since we may be pointing at a
        // new project/server
        this._resetBackoff();
    },

    /*
     * Wrap code within a context so Raven can capture errors
     * reliably across domains that is executed immediately.
     *
     * @param {object} options A specific set of options for this context [optional]
     * @param {function} func The callback to be immediately executed within the context
     * @param {array} args An array of arguments to be called with the callback [optional]
     */
    context: function(options, func, args) {
        if (isFunction(options)) {
            args = func || [];
            func = options;
            options = undefined;
        }

        return this.wrap(options, func).apply(this, args);
    },

    /*
     * Wrap code within a context and returns back a new function to be executed
     *
     * @param {object} options A specific set of options for this context [optional]
     * @param {function} func The function to be wrapped in a new context
     * @param {function} func A function to call before the try/catch wrapper [optional, private]
     * @return {function} The newly wrapped functions with a context
     */
    wrap: function(options, func, _before) {
        var self = this;
        // 1 argument has been passed, and it's not a function
        // so just return it
        if (isUndefined(func) && !isFunction(options)) {
            return options;
        }

        // options is optional
        if (isFunction(options)) {
            func = options;
            options = undefined;
        }

        // At this point, we've passed along 2 arguments, and the second one
        // is not a function either, so we'll just return the second argument.
        if (!isFunction(func)) {
            return func;
        }

        // We don't wanna wrap it twice!
        try {
            if (func.__raven__) {
                return func;
            }

            // If this has already been wrapped in the past, return that
            if (func.__raven_wrapper__) {
                return func.__raven_wrapper__;
            }
        } catch (e) {
            // Just accessing custom props in some Selenium environments
            // can cause a "Permission denied" exception (see raven-js#495).
            // Bail on wrapping and return the function as-is (defers to window.onerror).
            return func;
        }

        // We keep this function name unminified and look for it in the stack trace
        // in _prepareFrames so we can mark Raven frames as in_app: false
        const {
            ravenWrapped
        } = {
            ['raven' + 'Wrapped']() {
                var args = [],
                    i = arguments.length,
                    deep = !options || (options && options.deep !== false);

                if (_before && isFunction(_before)) {
                    _before.apply(this, arguments);
                }

                // Recursively wrap all of a function's arguments that are
                // functions themselves.
                while (i--)
                    args[i] = deep ? self.wrap(options, arguments[i]) : arguments[i];

                try {
                    // Attempt to invoke user-land function
                    // NOTE: If you are a Sentry user, and you are seeing this stack frame, it
                    //       means Raven caught an error invoking your application code. This is
                    //       expected behavior and NOT indicative of a bug with Raven.js.
                    return func.apply(this, args);
                } catch (e) {
                    self._ignoreNextOnError();
                    self.captureException(e, options);
                    throw e;
                }
            },
        };

        // copy over properties of the old function
        for (var property in func) {
            if (hasKey(func, property)) {
                ravenWrapped[property] = func[property];
            }
        }
        ravenWrapped.prototype = func.prototype;

        func.__raven_wrapper__ = ravenWrapped;
        // Signal that this function has been wrapped already
        // for both debugging and to prevent it to being wrapped twice
        ravenWrapped.__raven__ = true;
        ravenWrapped.__inner__ = func;

        return ravenWrapped;
    },

    /*
     * Uninstalls the global error handler.
     *
     * @return {Raven}
     */
    uninstall: function() {
        TraceKit.report.uninstall();

        this._restoreBuiltIns();

        Error.stackTraceLimit = this._originalErrorStackTraceLimit;
        this._isRavenInstalled = false;

        return this;
    },

    /**
     * Custom method created for our (HubSpot's) version of raven for submitting
     * custom events to LogFetch for purpose of tracking non-error events.
     *
     * @param {*} eventName The name of the event to be tracked
     * @param {*} extraData Data to be sent along with the event
     */
    capturePageEvent: function(eventName, options = {}) {
        // delete error cause props if they exist.
        this._clearExtraAttribute('errorCauseMessage');
        this._clearExtraAttribute('errorCauseStackFrames');

        const data = {
            message: eventName,
            ...options,
            level: 'info',
            isPageEvent: true,
        };

        this._send(data);

        return this;
    },

    /*
     * Manually capture an exception and send it over to Sentry
     *
     * @param {error} ex An exception to be logged
     * @param {object} options A specific set of options for this error [optional]
     * @return {Raven}
     */
    captureException: function(ex, options) {
        // delete previous exception's cause if they exist.
        var self = this;

        if (!self) {
            console.error(
                'Error: captureException was called without Raven instance. This error will not be sent.\nSee https://product.hubteam.com/docs/observability/docs/errors/raven-usage.html#context for more information.'
            );
            return this;
        }
        self._clearExtraAttribute('errorCauseMessage');
        self._clearExtraAttribute('errorCauseStackFrames');

        // Cases for sending ex as a message, rather than an exception
        var isNotError = !isError(ex);
        var isNotErrorEvent = !isErrorEvent(ex);
        var isErrorEventWithoutError = isErrorEvent(ex) && !ex.error;

        if ((isNotError && isNotErrorEvent) || isErrorEventWithoutError) {
            return this.captureMessage(
                ex,
                objectMerge({
                        trimHeadFrames: 1,
                        stacktrace: true, // if we fall back to captureMessage, default to attempting a new trace
                    },
                    options
                )
            );
        }

        // Get actual Error from ErrorEvent
        if (isErrorEvent(ex)) ex = ex.error;

        var errorCause = ex.cause;
        if (errorCause) {
            self._processErrorCause(errorCause);
        }

        // Capture extraData if it's set on the Error
        if (ex.extraData) {
            self.setExtraContext({ ...ex.extraData
            });
        }

        // Detect and enhance CHIRP errors
        if (
            this._globalOptions.chirpErrorEnhancement.enabled &&
            this._isChirpError(ex)
        ) {
            this._enhanceChirpError(ex);
        }

        // Store the raw exception object for potential debugging and introspection
        this._lastCapturedException = ex;

        // TraceKit.report will re-raise any exception passed to it,
        // which means you have to wrap it in try/catch. Instead, we
        // can wrap it here and only re-raise if TraceKit.report
        // raises an exception different from the one we asked to
        // report on.
        try {
            var stack = TraceKit.computeStackTrace(ex);
            this._handleStackInfo(stack, options);
        } catch (ex1) {
            if (ex !== ex1) {
                throw ex1;
            }
        }

        return this;
    },

    /*
     * Manually send a message to Sentry
     *
     * @param {string} msg A plain message to be captured in Sentry
     * @param {object} options A specific set of options for this message [optional]
     * @return {Raven}
     */
    captureMessage: function(msg, options) {
        var self = this;
        self._clearExtraAttribute('errorCauseMessage');
        self._clearExtraAttribute('errorCauseStackFrames');

        // Handle objects that are not errors (e.g., from unhandled promise rejections)
        // Serialize them properly instead of converting to '[object Object]'
        var messageString = msg;
        if (isObject(msg) && !isError(msg)) {
            try {
                // Safely serialize object with size limits to prevent arbitrarily large payloads
                var objData = this._serializeObjectSafely(msg);
                var objKeys = Object.keys(msg);

                // Add object info to options.extra
                options = options || {};
                options.extra = objectMerge(options.extra || {}, {
                    reasonObjKeys: truncate(objKeys.join(','), 200),
                    typeOfReason: 'Object',
                    rejectionReason: objData,
                });

                // Create a meaningful error message
                // Try to extract common error-like properties
                if (msg.message) {
                    messageString = String(msg.message);
                } else if (msg.error) {
                    messageString = String(msg.error);
                } else {
                    // Use JSON.stringify as fallback, with truncation
                    try {
                        var stringified = stringify(msg);
                        messageString = truncate(stringified, 200);
                    } catch (stringifyError) {
                        messageString = 'Non-serializable object rejection';
                    }
                }
            } catch (processingError) {
                // If we fail to process the object, use a generic message
                messageString = 'Object rejection (processing failed)';
            }
        }

        // config() automagically converts ignoreErrors from a list to a RegExp so we need to test for an
        // early call; we'll error on the side of logging anything called before configuration since it's
        // probably something you should see:
        if (!!this._globalOptions.ignoreErrors.test &&
            this._globalOptions.ignoreErrors.test(messageString)
        ) {
            this._triggerEvent('captureIgnored', {
                level: (options && options.level) || 'error',
            });
            return;
        }

        options = options || {};

        var data = objectMerge({
                message: messageString + '', // Make sure it's actually a string
            },
            options
        );

        var ex;
        // Generate a "synthetic" stack trace from this point.
        // NOTE: If you are a Sentry user, and you are seeing this stack frame, it is NOT indicative
        //       of a bug with Raven.js. Sentry generates synthetic traces either by configuration,
        //       or if it catches a thrown object without a "stack" property.
        try {
            throw new Error(msg);
        } catch (ex1) {
            ex = ex1;
        }

        // null exception name so `Error` isn't prefixed to msg
        ex.name = null;
        var stack = TraceKit.computeStackTrace(ex);

        // stack[0] is `throw new Error(msg)` call itself, we are interested in the frame that was just before that, stack[1]
        var initialCall = stack.stack[1];

        var fileurl = (initialCall && initialCall.url) || '';

        if (!!this._globalOptions.ignoreUrls.test &&
            this._globalOptions.ignoreUrls.test(fileurl)
        ) {
            return;
        }

        if (!!this._globalOptions.whitelistUrls.test &&
            !this._globalOptions.whitelistUrls.test(fileurl)
        ) {
            return;
        }

        if (this._globalOptions.stacktrace || (options && options.stacktrace)) {
            options = {
                // By default, fingerprint on msg, not stack trace
                // (legacy behavior, could be revisited)
                fingerprint: msg,
                ...options,
                // since we know this is a synthetic trace, the top N-most frames
                // MUST be from Raven.js, so mark them as in_app later by setting
                // trimHeadFrames
                trimHeadFrames: (options.trimHeadFrames || 0) + 1,
            };

            var frames = this._prepareFrames(stack, options);
            data.stacktrace = {
                // Sentry expects frames oldest to newest
                frames: frames.reverse(),
            };
        }

        // Fire away!
        this._send(data);

        return this;
    },

    captureBreadcrumb: function(obj) {
        var crumb = objectMerge({
                timestamp: now() / 1000,
            },
            obj
        );

        if (isFunction(this._globalOptions.breadcrumbCallback)) {
            var result = this._globalOptions.breadcrumbCallback(crumb);

            if (isObject(result) && !isEmptyObject(result)) {
                crumb = result;
            } else if (result === false) {
                return this;
            }
        }

        this._breadcrumbs.push(crumb);
        if (this._breadcrumbs.length > this._globalOptions.maxBreadcrumbs) {
            this._breadcrumbs.shift();
        }
        return this;
    },

    addPlugin: function(plugin /*arg1, arg2, ... argN*/ ) {
        var pluginArgs = [].slice.call(arguments, 1);

        this._plugins.push([plugin, pluginArgs]);
        if (this._isRavenInstalled) {
            this._drainPlugins();
        }

        return this;
    },

    /*
     * Set/clear a user to be sent along with the payload.
     *
     * @param {object} user An object representing user data [optional]
     * @return {Raven}
     */
    setUserContext: function(user) {
        // Intentionally do not merge here since that's an unexpected behavior.
        this._globalContext.user = user;

        return this;
    },

    /*
     * Merge extra attributes to be sent along with the payload.
     *
     * @param {object} extra An object representing extra data [optional]
     * @return {Raven}
     */
    setExtraContext: function(extra) {
        this._mergeContext('extra', extra);

        return this;
    },

    /*
     * Merge tags to be sent along with the payload.
     *
     * @param {object} tags An object representing tags [optional]
     * @return {Raven}
     */
    setTagsContext: function(tags) {
        this._mergeContext('tags', tags);

        return this;
    },

    /*
     * Clear all of the context.
     *
     * @return {Raven}
     */
    clearContext: function() {
        this._globalContext = {};

        return this;
    },

    /*
     * Get a copy of the current context. This cannot be mutated.
     *
     * @return {object} copy of context
     */
    getContext: function() {
        // lol javascript
        return JSON.parse(stringify(this._globalContext));
    },

    /*
     * Set environment of application
     *
     * @param {string} environment Typically something like 'production'.
     * @return {Raven}
     */
    setEnvironment: function(environment) {
        this._globalOptions.environment = environment;

        return this;
    },

    /*
     * Set release version of application
     *
     * @param {string} release Typically something like a git SHA to identify version
     * @return {Raven}
     */
    setRelease: function(release) {
        this._globalOptions.release = release;

        return this;
    },

    setIgnoreErrors: function(ignoreErrors) {
        this._globalOptions.ignoreErrors = ignoreErrors.length ?
            joinRegExp(ignoreErrors) :
            false;

        return this;
    },

    setIgnoreUrls: function(ignoreUrls) {
        this._globalOptions.ignoreUrls = ignoreUrls.length ?
            joinRegExp(ignoreUrls) :
            false;

        return this;
    },

    /*
     * Set the dataCallback option
     *
     * @param {function} callback The callback to run which allows the
     *                            data blob to be mutated before sending
     * @return {Raven}
     */
    setDataCallback: function(callback) {
        var original = this._globalOptions.dataCallback;
        this._globalOptions.dataCallback = keepOriginalCallback(original, callback);
        return this;
    },

    /*
     * Set the breadcrumbCallback option
     *
     * @param {function} callback The callback to run which allows filtering
     *                            or mutating breadcrumbs
     * @return {Raven}
     */
    setBreadcrumbCallback: function(callback) {
        var original = this._globalOptions.breadcrumbCallback;
        this._globalOptions.breadcrumbCallback = keepOriginalCallback(
            original,
            callback
        );
        return this;
    },

    /*
     * Set the shouldSendCallback option
     *
     * @param {function} callback The callback to run which allows
     *                            introspecting the blob before sending
     * @return {Raven}
     */
    setShouldSendCallback: function(callback) {
        var original = this._globalOptions.shouldSendCallback;
        this._globalOptions.shouldSendCallback = keepOriginalCallback(
            original,
            callback
        );
        return this;
    },

    /**
     * Override the default HTTP transport mechanism that transmits data
     * to the Sentry server.
     *
     * @param {function} transport Function invoked instead of the default
     *                             `makeRequest` handler.
     *
     * @return {Raven}
     */
    setTransport: function(transport) {
        this._globalOptions.transport = transport;

        return this;
    },

    /*
     * Get the latest raw exception that was captured by Raven.
     *
     * @return {error}
     */
    lastException: function() {
        return this._lastCapturedException;
    },

    /*
     * Get the last event id
     *
     * @return {string}
     */
    lastEventId: function() {
        return this._lastEventId;
    },

    /*
     * Determine if Raven is setup and ready to go.
     *
     * @return {boolean}
     */
    isSetup: function() {
        if (!this._hasJSON) return false; // needs JSON support
        if (!this._globalServer) {
            if (!this.ravenNotConfiguredError) {
                this.ravenNotConfiguredError = true;
            }
            this._logDebug('error', 'Error: Raven has not been configured.');

            return false;
        }
        return true;
    },

    afterLoad: function() {
        // TODO: remove window dependence?

        // Attempt to initialize Raven on load
        var RavenConfig = _window.RavenConfig;
        if (RavenConfig) {
            this.config(RavenConfig.dsn, RavenConfig.config).install();
        }
    },

    showReportDialog: function(options) {
        if (!_document // doesn't work without a document (React native)
        )
            return;

        options = options || {};

        var lastEventId = options.eventId || this.lastEventId();
        if (!lastEventId) {
            throw new RavenConfigError('Missing eventId');
        }

        var dsn = options.dsn || this._dsn;
        if (!dsn) {
            throw new RavenConfigError('Missing DSN');
        }

        var encode = encodeURIComponent;
        var qs = '';
        qs += '?eventId=' + encode(lastEventId);
        qs += '&dsn=' + encode(dsn);

        var user = options.user || this._globalContext.user;
        if (user) {
            if (user.name) qs += '&name=' + encode(user.name);
            if (user.email) qs += '&email=' + encode(user.email);
        }

        var globalServer = this._getGlobalServer(this._parseDSN(dsn));

        var script = _document.createElement('script');
        script.async = true;
        script.src = globalServer + '/api/embed/error-page/' + qs;
        (_document.head || _document.body).appendChild(script);
    },

    /**** Private functions ****/
    /**
     * Safely serialize an object with size limits to prevent sending arbitrarily large data
     * @param {*} obj The object to serialize
     * @param {number} maxDepth Maximum nesting depth (default: 3)
     * @param {number} maxKeys Maximum number of keys to extract (default: 20)
     * @param {number} maxValueLength Maximum length for string values (default: 500)
     * @param {number} maxTotalSize Maximum total size of serialized JSON (default: 10000 chars)
     * @returns {Object} Limited serialized object
     * @private
     */
    _serializeObjectSafely: function(
        obj,
        maxDepth,
        maxKeys,
        maxValueLength,
        maxTotalSize
    ) {
        maxDepth = maxDepth !== undefined ? maxDepth : 3;
        maxKeys = maxKeys !== undefined ? maxKeys : 20;
        maxValueLength = maxValueLength !== undefined ? maxValueLength : 500;
        maxTotalSize = maxTotalSize !== undefined ? maxTotalSize : 10000;

        var keysProcessed = 0;

        function serializeValue(value, depth) {
            if (depth >= maxDepth) {
                return '[max depth reached]';
            }

            if (value === null) {
                return null;
            }

            if (value === undefined) {
                return '[undefined]';
            }

            var type = typeof value;

            if (type === 'string') {
                return truncate(value, maxValueLength);
            }

            if (type === 'number' || type === 'boolean') {
                return value;
            }

            if (type === 'function') {
                return '[Function: ' + (value.name || 'anonymous') + ']';
            }

            if (isError(value)) {
                return '[Error: ' + truncate(value.message || '', maxValueLength) + ']';
            }

            if (Array.isArray(value)) {
                var arr = [];
                for (var i = 0; i < Math.min(value.length, 10); i++) {
                    arr.push(serializeValue(value[i], depth + 1));
                }
                if (value.length > 10) {
                    arr.push('[... ' + (value.length - 10) + ' more items]');
                }
                return arr;
            }

            if (isObject(value)) {
                var result = {};
                var keys = Object.keys(value);
                var keyCount = 0;

                for (var j = 0; j < keys.length; j++) {
                    if (keysProcessed >= maxKeys || keyCount >= 10) {
                        result['[truncated]'] =
                            keys.length - keyCount + ' more keys not shown';
                        break;
                    }

                    var key = keys[j];
                    try {
                        result[key] = serializeValue(value[key], depth + 1);
                        keysProcessed++;
                        keyCount++;
                    } catch (e) {
                        result[key] = '[error reading property]';
                    }
                }
                return result;
            }

            return String(value);
        }

        try {
            var serialized = serializeValue(obj, 0);

            // Check total size and truncate if needed
            var serializedString = stringify(serialized);
            if (serializedString && serializedString.length > maxTotalSize) {
                // If too large, try with more aggressive limits
                keysProcessed = 0;
                serialized = serializeValue(obj, 0);
                serializedString = stringify(serialized);

                // If still too large, just indicate it was truncated
                if (serializedString && serializedString.length > maxTotalSize) {
                    return {
                        '[truncated]': 'Object too large to serialize fully',
                        '[size]': serializedString.length + ' chars',
                    };
                }
            }

            return serialized;
        } catch (e) {
            return {
                '[error]': 'Failed to serialize object: ' + e.message
            };
        }
    },

    _processErrorCause: function(errorCause) {
        try {
            var self = this;
            var errorCauseStack = TraceKit.computeStackTrace(errorCause);
            var errorCauseStackFrames = this._prepareFrames(errorCauseStack, {}).map(
                (stackFrame) => {
                    return {
                        file: stackFrame.filename,
                        methodName: stackFrame.function || '?',
                        lineNumber: stackFrame.lineno,
                        column: stackFrame.colno,
                    };
                }
            );

            if (errorCauseStack.message) {
                self.setExtraContext({
                    errorCauseMessage: errorCauseStack.message,
                });
            }

            if (errorCauseStackFrames && errorCauseStackFrames.length) {
                self.setExtraContext({
                    errorCauseStackFrames: JSON.stringify(errorCauseStackFrames),
                });
            }
        } catch (ex1) {
            if (errorCause !== ex1) {
                throw ex1;
            }
        }
    },

    /**** CHIRP Error Enhancement Methods ****/

    _isChirpError: function(error) {
        if (!error) return false;

        // Check for CHIRP error patterns:
        // - Message contains "CHIRP RPC failed"
        // - Has the nested error.cause.cause structure
        // - Contains ChirpError or ChirpInternalError instances
        return (
            (error.message &&
                error.message.includes &&
                error.message.includes('CHIRP RPC failed')) ||
            this._hasChirpErrorStructure(error) ||
            this._containsChirpErrorInstance(error)
        );
    },

    _hasChirpErrorStructure: function(error) {
        return !!(error.cause && error.cause.cause);
    },

    _containsChirpErrorInstance: function(error) {
        const deepError = error.cause && error.cause.cause;
        return !!(
            (
                deepError &&
                ((deepError.constructor &&
                        deepError.constructor.name === 'ChirpError') ||
                    (deepError.constructor &&
                        deepError.constructor.name === 'ChirpInternalError') ||
                    !!deepError.type)
            ) // CHIRP errors often have a 'type' property
        );
    },

    _enhanceChirpError: function(error) {
        // Skip enhancement if error is not an Error object
        if (!isError(error)) {
            return;
        }

        const chirpContext = this._extractChirpContext(error);

        if (chirpContext) {
            // Automatically add structured CHIRP metadata
            this.setExtraContext({
                // Service identification
                chirpServiceName: chirpContext.serviceName,
                chirpMethodName: chirpContext.methodName,
                chirpErrorType: chirpContext.errorType,

                // Error details
                chirpUserDefinedError: chirpContext.userDefinedError,
                chirpInternalErrorType: chirpContext.internalErrorType,
                chirpOriginalMessage: chirpContext.originalMessage,

                // Call context
                chirpCallStack: chirpContext.callStack,
                chirpRequestInfo: chirpContext.requestInfo,
            });

            // Enhance the error message for better visibility
            if (this._globalOptions.chirpErrorEnhancement.enhanceErrorMessages) {
                try {
                    error.message = this._formatEnhancedChirpMessage(
                        error.message,
                        chirpContext
                    );
                } catch (e) {
                    // If we can't modify the message property (e.g., it's read-only), skip enhancement
                    this._logDebug('warn', 'Failed to enhance CHIRP error message:', e);
                }
            }
        }
    },

    _extractChirpContext: function(error) {
        const context = {};

        try {
            // Extract service/method from message pattern
            if (error.message) {
                const messageMatch = error.message.match(/CHIRP RPC failed for (\w+)/);
                if (messageMatch) {
                    context.methodName = messageMatch[1];
                }
            }

            // Navigate the error structure with depth limit
            let currentError = error;
            let depth = 0;
            const maxDepth =
                this._globalOptions.chirpErrorEnhancement.maxNestingDepth;

            while (currentError && depth < maxDepth) {
                if (currentError.cause) {
                    currentError = currentError.cause;
                    depth++;
                } else {
                    break;
                }
            }

            // Extract from the deepest error found
            const deepError = currentError;

            // Always try to extract service name from stack trace or error properties
            context.serviceName = this._extractServiceName(error, deepError);

            if (deepError && deepError !== error) {
                context.errorType = deepError.type || 'UNKNOWN';
                context.originalMessage =
                    deepError.chirpErrorMessage || deepError.message;

                // Determine if it's user-defined or internal error
                if (
                    (deepError.constructor &&
                        deepError.constructor.name === 'ChirpError') ||
                    deepError.type === 'userDefinedError'
                ) {
                    context.userDefinedError = deepError;
                    context.errorType = 'USER_DEFINED';
                } else if (
                    (deepError.constructor &&
                        deepError.constructor.name === 'ChirpInternalError') ||
                    deepError.type === 'internalError'
                ) {
                    context.internalErrorType =
                        deepError.type ||
                        (deepError.internalError && deepError.internalError.type);
                    context.errorType = 'INTERNAL_ERROR';
                }

                // Include call stack if enabled
                if (this._globalOptions.chirpErrorEnhancement.includeCallStack) {
                    context.callStack = error.stack;
                }
            }
        } catch (e) {
            // If context extraction fails, don't break the error reporting
            this._logDebug('warn', 'Failed to extract CHIRP context:', e);
        }

        return context;
    },

    _extractServiceName: function(error, deepError) {
        try {
            // Try multiple sources for service name

            // 1. From stack trace URLs
            const stack = error.stack || (error.cause && error.cause.stack);
            if (stack) {
                const serviceMatch = stack.match(/\/chirp\/([^\/]+)\//);
                if (serviceMatch) return serviceMatch[1];
            }

            // 2. From error properties
            if (deepError.serviceName) return deepError.serviceName;
            if (deepError.service) return deepError.service;

            return 'UNKNOWN_SERVICE';
        } catch (e) {
            return 'UNKNOWN_SERVICE';
        }
    },

    _formatEnhancedChirpMessage: function(originalMessage, context) {
        let enhanced = originalMessage;

        if (context.serviceName && context.serviceName !== 'UNKNOWN_SERVICE') {
            enhanced += ' [Service: ' + context.serviceName + ']';
        }

        if (context.methodName) {
            enhanced += ' [Method: ' + context.methodName + ']';
        }

        if (context.errorType && context.errorType !== 'UNKNOWN') {
            enhanced += ' [Type: ' + context.errorType + ']';
        }

        if (
            context.originalMessage &&
            context.originalMessage !== originalMessage
        ) {
            enhanced += ' [Details: ' + context.originalMessage + ']';
        }

        return enhanced;
    },

    _clearExtraAttribute: function(key) {
        var self = this;
        if (!isUndefined(self._globalContext.extra)) {
            delete self._globalContext.extra[key];
        }
    },

    _ignoreNextOnError: function() {
        var self = this;
        this._ignoreOnError += 1;
        setTimeout(function() {
            // onerror should trigger before setTimeout
            self._ignoreOnError -= 1;
        });
    },

    _triggerEvent: function(eventType, options) {
        // NOTE: `event` is a native browser thing, so let's avoid conflicting wiht it
        var evt, key;

        if (!this._hasDocument) return;

        options = options || {};

        eventType =
            'raven' + eventType.substr(0, 1).toUpperCase() + eventType.substr(1);

        if (_document.createEvent) {
            evt = _document.createEvent('HTMLEvents');
            evt.initEvent(eventType, true, true);
        } else {
            evt = _document.createEventObject();
            evt.eventType = eventType;
        }

        for (key in options)
            if (hasKey(options, key)) {
                evt[key] = options[key];
            }

        if (_document.createEvent) {
            // IE9 if standards
            _document.dispatchEvent(evt);
        } else {
            // IE8 regardless of Quirks or Standards
            // IE9 if quirks
            try {
                _document.fireEvent('on' + evt.eventType.toLowerCase(), evt);
            } catch (e) {
                // Do nothing
            }
        }
    },

    /**
     * Wraps addEventListener to capture UI breadcrumbs
     * @param evtName the event name (e.g. "click")
     * @returns {Function}
     * @private
     */
    _breadcrumbEventHandler: function(evtName) {
        var self = this;
        return function(evt) {
            // reset keypress timeout; e.g. triggering a 'click' after
            // a 'keypress' will reset the keypress debounce so that a new
            // set of keypresses can be recorded
            self._keypressTimeout = null;

            // It's possible this handler might trigger multiple times for the same
            // event (e.g. event propagation through node ancestors). Ignore if we've
            // already captured the event.
            if (self._lastCapturedEvent === evt) return;

            self._lastCapturedEvent = evt;

            // try/catch both:
            // - accessing evt.target (see getsentry/raven-js#838, #768)
            // - `htmlTreeAsString` because it's complex, and just accessing the DOM incorrectly
            //   can throw an exception in some circumstances.
            var target;
            try {
                target = htmlTreeAsString(evt.target);
            } catch (e) {
                target = '<unknown>';
            }

            self.captureBreadcrumb({
                category: 'ui.' + evtName, // e.g. ui.click, ui.input
                message: target,
            });
        };
    },

    /**
     * Wraps addEventListener to capture keypress UI events
     * @returns {Function}
     * @private
     */
    _keypressEventHandler: function() {
        var self = this,
            debounceDuration = 1000; // milliseconds

        // TODO: if somehow user switches keypress target before
        //       debounce timeout is triggered, we will only capture
        //       a single breadcrumb from the FIRST target (acceptable?)
        return function(evt) {
            var target;
            try {
                target = evt.target;
            } catch (e) {
                // just accessing event properties can throw an exception in some rare circumstances
                // see: https://github.com/getsentry/raven-js/issues/838
                return;
            }
            var tagName = target && target.tagName;

            // only consider keypress events on actual input elements
            // this will disregard keypresses targeting body (e.g. tabbing
            // through elements, hotkeys, etc)
            if (!tagName ||
                (tagName !== 'INPUT' &&
                    tagName !== 'TEXTAREA' &&
                    !target.isContentEditable)
            )
                return;

            // record first keypress in a series, but ignore subsequent
            // keypresses until debounce clears
            var timeout = self._keypressTimeout;
            if (!timeout) {
                self._breadcrumbEventHandler('input')(evt);
            }
            clearTimeout(timeout);
            self._keypressTimeout = setTimeout(function() {
                self._keypressTimeout = null;
            }, debounceDuration);
        };
    },

    /**
     * Captures a breadcrumb of type "navigation", normalizing input URLs
     * @param to the originating URL
     * @param from the target URL
     * @private
     */
    _captureUrlChange: function(from, to) {
        var parsedLoc = parseUrl(this._location.href);
        var parsedTo = parseUrl(to);
        var parsedFrom = parseUrl(from);

        // because onpopstate only tells you the "new" (to) value of location.href, and
        // not the previous (from) value, we need to track the value of the current URL
        // state ourselves
        this._lastHref = to;

        // Use only the path component of the URL if the URL matches the current
        // document (almost all the time when using pushState)
        if (
            parsedLoc.protocol === parsedTo.protocol &&
            parsedLoc.host === parsedTo.host
        )
            to = parsedTo.relative;
        if (
            parsedLoc.protocol === parsedFrom.protocol &&
            parsedLoc.host === parsedFrom.host
        )
            from = parsedFrom.relative;

        this.captureBreadcrumb({
            category: 'navigation',
            data: {
                to: redactSensitiveUrlParams(to),
                from: redactSensitiveUrlParams(from),
            },
        });
    },

    /**
     * Wrap timer functions and event targets to catch errors and provide
     * better metadata.
     */
    _instrumentTryCatch: function() {
        var self = this;

        var wrappedBuiltIns = self._wrappedBuiltIns;

        function wrapTimeFn(orig) {
            return function(fn, t) {
                // preserve arity
                // Make a copy of the arguments to prevent deoptimization
                // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
                var args = new Array(arguments.length);
                for (var i = 0; i < args.length; ++i) {
                    args[i] = arguments[i];
                }
                var originalCallback = args[0];
                if (isFunction(originalCallback)) {
                    args[0] = self.wrap(originalCallback);
                }

                // IE < 9 doesn't support .call/.apply on setInterval/setTimeout, but it
                // also supports only two arguments and doesn't care what this is, so we
                // can just call the original function directly.
                if (orig.apply) {
                    return orig.apply(this, args);
                } else {
                    return orig(args[0], args[1]);
                }
            };
        }

        var autoBreadcrumbs = this._globalOptions.autoBreadcrumbs;

        function wrapEventTarget(global) {
            var proto = _window[global] && _window[global].prototype;
            if (
                proto &&
                proto.hasOwnProperty &&
                proto.hasOwnProperty('addEventListener')
            ) {
                fill(
                    proto,
                    'addEventListener',
                    function(orig) {
                        return function(evtName, fn, capture, secure) {
                            // preserve arity
                            try {
                                if (fn && fn.handleEvent) {
                                    fn.handleEvent = self.wrap(fn.handleEvent);
                                }
                            } catch (err) {
                                // can sometimes get 'Permission denied to access property "handle Event'
                            }

                            // More breadcrumb DOM capture ... done here and not in `_instrumentBreadcrumbs`
                            // so that we don't have more than one wrapper function
                            var before, clickHandler, keypressHandler;

                            if (
                                autoBreadcrumbs &&
                                autoBreadcrumbs.dom &&
                                (global === 'EventTarget' || global === 'Node')
                            ) {
                                // NOTE: generating multiple handlers per addEventListener invocation, should
                                //       revisit and verify we can just use one (almost certainly)
                                clickHandler = self._breadcrumbEventHandler('click');
                                keypressHandler = self._keypressEventHandler();
                                before = function(evt) {
                                    // need to intercept every DOM event in `before` argument, in case that
                                    // same wrapped method is re-used for different events (e.g. mousemove THEN click)
                                    // see #724
                                    if (!evt) return;

                                    var eventType;
                                    try {
                                        eventType = evt.type;
                                    } catch (e) {
                                        // just accessing event properties can throw an exception in some rare circumstances
                                        // see: https://github.com/getsentry/raven-js/issues/838
                                        return;
                                    }
                                    if (eventType === 'click') return clickHandler(evt);
                                    else if (eventType === 'keypress')
                                        return keypressHandler(evt);
                                };
                            }
                            return orig.call(
                                this,
                                evtName,
                                self.wrap(fn, undefined, before),
                                capture,
                                secure
                            );
                        };
                    },
                    wrappedBuiltIns
                );
                fill(
                    proto,
                    'removeEventListener',
                    function(orig) {
                        return function(evt, fn, capture, secure) {
                            try {
                                fn = fn && (fn.__raven_wrapper__ ? fn.__raven_wrapper__ : fn);
                            } catch (e) {
                                // ignore, accessing __raven_wrapper__ will throw in some Selenium environments
                            }
                            return orig.call(this, evt, fn, capture, secure);
                        };
                    },
                    wrappedBuiltIns
                );
            }
        }

        fill(_window, 'setTimeout', wrapTimeFn, wrappedBuiltIns);
        fill(_window, 'setInterval', wrapTimeFn, wrappedBuiltIns);
        if (_window.requestAnimationFrame) {
            fill(
                _window,
                'requestAnimationFrame',
                function(orig) {
                    return function(cb) {
                        return orig(self.wrap(cb));
                    };
                },
                wrappedBuiltIns
            );
        }

        // event targets borrowed from bugsnag-js:
        // https://github.com/bugsnag/bugsnag-js/blob/master/src/bugsnag.js#L666
        var eventTargets = [
            'EventTarget',
            'Window',
            'Node',
            'ApplicationCache',
            'AudioTrackList',
            'ChannelMergerNode',
            'CryptoOperation',
            'EventSource',
            'FileReader',
            'HTMLUnknownElement',
            'IDBDatabase',
            'IDBRequest',
            'IDBTransaction',
            'KeyOperation',
            'MediaController',
            'MessagePort',
            'ModalWindow',
            'Notification',
            'SVGElementInstance',
            'Screen',
            'TextTrack',
            'TextTrackCue',
            'TextTrackList',
            'WebSocket',
            'WebSocketWorker',
            'Worker',
            'XMLHttpRequest',
            'XMLHttpRequestEventTarget',
            'XMLHttpRequestUpload',
        ];
        for (var i = 0; i < eventTargets.length; i++) {
            wrapEventTarget(eventTargets[i]);
        }
    },

    /**
     * Instrument browser built-ins w/ breadcrumb capturing
     *  - XMLHttpRequests
     *  - DOM interactions (click/typing)
     *  - window.location changes
     *  - console
     *
     * Can be disabled or individually configured via the `autoBreadcrumbs` config option
     */
    _instrumentBreadcrumbs: function() {
        var self = this;
        var autoBreadcrumbs = this._globalOptions.autoBreadcrumbs;

        var wrappedBuiltIns = self._wrappedBuiltIns;

        function wrapProp(prop, xhr) {
            if (prop in xhr && isFunction(xhr[prop])) {
                fill(xhr, prop, function(orig) {
                    return self.wrap(orig);
                }); // intentionally don't track filled methods on XHR instances
            }
        }

        if (autoBreadcrumbs.xhr && 'XMLHttpRequest' in _window) {
            var xhrproto = XMLHttpRequest.prototype;
            fill(
                xhrproto,
                'open',
                function(origOpen) {
                    return function(method, url) {
                        // preserve arity

                        // if Sentry key appears in URL, don't capture
                        if (
                            isString(url) &&
                            (!self._globalKey || url.indexOf(self._globalKey) === -1)
                        ) {
                            this.__raven_xhr = {
                                method: method,
                                url: url,
                                status_code: null,
                            };
                        }

                        return origOpen.apply(this, arguments);
                    };
                },
                wrappedBuiltIns
            );

            fill(
                xhrproto,
                'send',
                function(origSend) {
                    return function(data) {
                        // preserve arity
                        var xhr = this;

                        function onreadystatechangeHandler() {
                            if (xhr.__raven_xhr && xhr.readyState === 4) {
                                try {
                                    // touching statusCode in some platforms throws
                                    // an exception
                                    xhr.__raven_xhr.status_code = xhr.status;
                                    const correlationId = getCorrelationIdFromXHR(xhr);

                                    if (correlationId) {
                                        xhr.__raven_xhr.correlationId = correlationId;
                                    }
                                } catch (e) {
                                    /* do nothing */
                                }

                                self.captureBreadcrumb({
                                    type: 'http',
                                    category: 'xhr',
                                    data: xhr.__raven_xhr,
                                });
                            }
                        }

                        var props = ['onload', 'onerror', 'onprogress'];
                        for (var j = 0; j < props.length; j++) {
                            wrapProp(props[j], xhr);
                        }

                        if (
                            'onreadystatechange' in xhr &&
                            isFunction(xhr.onreadystatechange)
                        ) {
                            fill(
                                xhr,
                                'onreadystatechange',
                                function(orig) {
                                    return self.wrap(orig, undefined, onreadystatechangeHandler);
                                } /* intentionally don't track this instrumentation */
                            );
                        } else {
                            // if onreadystatechange wasn't actually set by the page on this xhr, we
                            // are free to set our own and capture the breadcrumb
                            xhr.onreadystatechange = onreadystatechangeHandler;
                        }

                        return origSend.apply(this, arguments);
                    };
                },
                wrappedBuiltIns
            );
        }

        if (autoBreadcrumbs.xhr && 'fetch' in _window) {
            fill(
                _window,
                'fetch',
                function(origFetch) {
                    // We keep this function name unminified and look for it in the stack trace
                    // in _prepareFrames so we can mark fetch wrapper frames as in_app: false
                    const {
                        ravenFetchWrapper
                    } = {
                        ['raven' + 'FetchWrapper']: function(fn, t) {
                            // preserve arity
                            // Make a copy of the arguments to prevent deoptimization
                            // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
                            var args = new Array(arguments.length);
                            for (var i = 0; i < args.length; ++i) {
                                args[i] = arguments[i];
                            }

                            var fetchInput = args[0];
                            var method = 'GET';
                            var url;

                            if (typeof fetchInput === 'string') {
                                url = fetchInput;
                            } else if (
                                'Request' in _window &&
                                fetchInput instanceof _window.Request
                            ) {
                                url = fetchInput.url;
                                if (fetchInput.method) {
                                    method = fetchInput.method;
                                }
                            } else {
                                url = '' + fetchInput;
                            }

                            if (args[1] && args[1].method) {
                                method = args[1].method;
                            }

                            var fetchData = {
                                method: method,
                                url: url,
                                status_code: null,
                            };

                            self.captureBreadcrumb({
                                type: 'http',
                                category: 'fetch',
                                data: fetchData,
                            });

                            return origFetch.apply(this, args).then(function(response) {
                                fetchData.status_code = response.status;

                                const correlationId = getCorrelationIdFromResponse(response);

                                if (correlationId) {
                                    fetchData.correlationId = correlationId;
                                }

                                return response;
                            });
                        },
                    };
                    return ravenFetchWrapper;
                },
                wrappedBuiltIns
            );
        }

        // Capture breadcrumbs from any click that is unhandled / bubbled up all the way
        // to the document. Do this before we instrument addEventListener.
        if (autoBreadcrumbs.dom && this._hasDocument) {
            if (_document.addEventListener) {
                _document.addEventListener(
                    'click',
                    self._breadcrumbEventHandler('click'),
                    false
                );
                _document.addEventListener(
                    'keypress',
                    self._keypressEventHandler(),
                    false
                );
            } else {
                // IE8 Compatibility
                _document.attachEvent('onclick', self._breadcrumbEventHandler('click'));
                _document.attachEvent('onkeypress', self._keypressEventHandler());
            }
        }

        // record navigation (URL) changes
        // NOTE: in Chrome App environment, touching history.pushState, *even inside
        //       a try/catch block*, will cause Chrome to output an error to console.error
        // borrowed from: https://github.com/angular/angular.js/pull/13945/files
        var chrome = _window.chrome;
        var isChromePackagedApp = chrome && chrome.app && chrome.app.runtime;
        var hasPushAndReplaceState = !isChromePackagedApp &&
            _window.history &&
            history.pushState &&
            history.replaceState;
        if (autoBreadcrumbs.location && hasPushAndReplaceState) {
            // TODO: remove onpopstate handler on uninstall()
            var oldOnPopState = _window.onpopstate;
            _window.onpopstate = function() {
                var currentHref = self._location.href;
                self._captureUrlChange(self._lastHref, currentHref);

                if (oldOnPopState) {
                    return oldOnPopState.apply(this, arguments);
                }
            };

            var historyReplacementFunction = function(origHistFunction) {
                // note history.pushState.length is 0; intentionally not declaring
                // params to preserve 0 arity
                return function( /* state, title, url */ ) {
                    var url = arguments.length > 2 ? arguments[2] : undefined;

                    // url argument is optional
                    if (url) {
                        // coerce to string (this is what pushState does)
                        self._captureUrlChange(self._lastHref, url + '');
                    }

                    return origHistFunction.apply(this, arguments);
                };
            };

            fill(history, 'pushState', historyReplacementFunction, wrappedBuiltIns);
            fill(
                history,
                'replaceState',
                historyReplacementFunction,
                wrappedBuiltIns
            );
        }

        if (autoBreadcrumbs.console && 'console' in _window && console.log) {
            // console
            var consoleMethodCallback = function(msg, data) {
                self.captureBreadcrumb({
                    message: msg,
                    level: data.level,
                    category: 'console',
                });
            };

            each(['debug', 'info', 'warn', 'error', 'log'], function(_, level) {
                wrapConsoleMethod(console, level, consoleMethodCallback);
            });
        }
    },

    _restoreBuiltIns: function() {
        // restore any wrapped builtins
        var builtin;
        while (this._wrappedBuiltIns.length) {
            builtin = this._wrappedBuiltIns.shift();

            var obj = builtin[0],
                name = builtin[1],
                orig = builtin[2];

            obj[name] = orig;
        }
    },

    _drainPlugins: function() {
        var self = this;

        // FIX ME TODO
        each(this._plugins, function(_, plugin) {
            var installer = plugin[0];
            var args = plugin[1];
            installer.apply(self, [self].concat(args));
        });
    },

    _parseDSN: function(str) {
        var m = dsnPattern.exec(str),
            dsn = {},
            i = 7;

        try {
            while (i--) dsn[dsnKeys[i]] = m[i] || '';
        } catch (e) {
            throw new RavenConfigError('Invalid DSN: ' + str);
        }

        if (dsn.pass && !this._globalOptions.allowSecretKey) {
            throw new RavenConfigError(
                'Do not specify your secret key in the DSN. See: http://bit.ly/raven-secret-key'
            );
        }

        return dsn;
    },

    _getGlobalServer: function(uri) {
        // assemble the endpoint from the uri pieces
        var host = uri.host;
        var tags = this._globalContext.tags;
        var hublet = (tags && tags['hublet']) || 'na1';
        var env = this._globalOptions.environment || 'prod';

        if (uri.host === 'exceptions.hubspot.com') {
            var hubletSuffix = hublet === 'na1' ? '' : `-${hublet}`;
            var envSuffix = env === 'prod' ? '' : `${env}`;

            host = `exceptions${hubletSuffix}.hubspot${envSuffix}.com`;
        }

        var globalServer = '//' + host + (uri.port ? ':' + uri.port : '');

        if (uri.protocol) {
            globalServer = uri.protocol + ':' + globalServer;
        }
        return globalServer;
    },

    _handleOnErrorStackInfo: function() {
        // if we are intentionally ignoring errors via onerror, bail out
        if (!this._ignoreOnError) {
            this._handleStackInfo.apply(this, arguments);
        }
    },

    _handleStackInfo: function(stackInfo, options) {
        var frames = this._prepareFrames(stackInfo, options);

        this._triggerEvent('handle', {
            stackInfo: stackInfo,
            options: options,
        });

        this._processException(
            stackInfo.name,
            stackInfo.message,
            stackInfo.url,
            stackInfo.lineno,
            frames,
            options
        );
    },

    _prepareFrames: function(stackInfo, options) {
        var self = this;
        var frames = [];
        if (stackInfo.stack && stackInfo.stack.length) {
            each(stackInfo.stack, function(i, stack) {
                var frame = self._normalizeFrame(stack, stackInfo.url);
                if (frame) {
                    frames.push(frame);
                }
            });

            // e.g. frames captured via captureMessage throw
            if (options && options.trimHeadFrames) {
                for (var j = 0; j < options.trimHeadFrames && j < frames.length; j++) {
                    frames[j].in_app = false;
                }
                // Continue marking frames from the same raven bundle URL as in_app: false.
                // trimHeadFrames covers the synthetic throw + captureMessage, but when
                // captureException falls through to captureMessage the captureException
                // frame is also in the raven bundle and must be excluded so errors aren't
                // attributed to raven-js instead of the calling project.
                var lastTrimIdx = Math.min(options.trimHeadFrames, frames.length) - 1;
                if (lastTrimIdx >= 0 && frames[lastTrimIdx].filename) {
                    var ravenBundleUrl = frames[lastTrimIdx].filename;
                    for (var m = options.trimHeadFrames; m < frames.length; m++) {
                        if (frames[m].filename === ravenBundleUrl) {
                            frames[m].in_app = false;
                        } else {
                            break;
                        }
                    }
                }
            }

            // Mark ravenWrapped and frames below it as not in_app
            // so errors don't get reported to the Raven source route.
            // Scan newest-to-oldest so that if there are multiple ravenWrapped frames
            // (e.g. React's event system wrapping inside Raven's outer wrapper),
            // we mark from the innermost one downward rather than stopping at the outermost.
            var foundRavenWrapped = false;
            for (var k = 0; k < frames.length; k++) {
                if (!foundRavenWrapped && frames[k].function.includes('ravenWrapped')) {
                    foundRavenWrapped = true;
                }
                if (foundRavenWrapped) {
                    frames[k].in_app = false;
                }
            }
            // Mark ravenFetchWrapper as not in_app so errors don't get reported to the Raven source route
            for (var l = 0; l < frames.length; l++) {
                if (frames[l].function.includes('ravenFetchWrapper')) {
                    frames[l].in_app = false;
                }
            }
        }

        frames = frames.slice(0, this._globalOptions.stackTraceLimit);
        return frames;
    },

    _normalizeFrame: function(frame, stackInfoUrl) {
        // normalize the frames data
        var normalized = {
            filename: frame.url,
            lineno: frame.line,
            colno: frame.column,
            function: frame.func || '?',
        };

        // Case when we don't have any information about the error
        // E.g. throwing a string or raw object, instead of an `Error` in Firefox
        // Generating synthetic error doesn't add any value here
        //
        // We should probably somehow let a user know that they should fix their code
        if (!frame.url) {
            normalized.filename = stackInfoUrl; // fallback to whole stacks url from onerror handler
        }

        normalized.in_app = !(
            // determine if an exception came from outside of our app
            // first we check the global includePaths list.
            (
                (!!this._globalOptions.includePaths.test &&
                    !this._globalOptions.includePaths.test(normalized.filename)) ||
                // Now we check for fun, if the function name is Raven or TraceKit
                /(Raven|TraceKit)\./.test(normalized['function'])
            )
        );

        return normalized;
    },

    _processException: function(
        type,
        message,
        fileurl,
        lineno,
        frames,
        options
    ) {
        var prefixedMessage = (type ? type + ': ' : '') + (message || '');
        let errorCause =
            (this._lastCapturedException &&
                this._lastCapturedException.cause &&
                this._lastCapturedException.cause.message) ||
            '';
        if (!!this._globalOptions.ignoreErrors.test &&
            (this._globalOptions.ignoreErrors.test(message) ||
                this._globalOptions.ignoreErrors.test(prefixedMessage) ||
                this._globalOptions.ignoreErrors.test(errorCause))
        ) {
            this._triggerEvent('captureIgnored', {
                level: (options && options.level) || 'error',
            });
            return;
        }

        var stacktrace;

        if (frames && frames.length) {
            fileurl = frames[0].filename || fileurl;
            // Sentry expects frames oldest to newest
            // and JS sends them as newest to oldest
            frames.reverse();
            stacktrace = {
                frames: frames
            };
        } else if (fileurl) {
            stacktrace = {
                frames: [{
                    filename: fileurl,
                    lineno: lineno,
                    in_app: true,
                }, ],
            };
        }

        if (!!this._globalOptions.ignoreUrls.test &&
            this._globalOptions.ignoreUrls.test(fileurl)
        ) {
            return;
        }

        if (!!this._globalOptions.whitelistUrls.test &&
            !this._globalOptions.whitelistUrls.test(fileurl)
        ) {
            return;
        }

        var data = objectMerge({
                // sentry.interfaces.Exception
                exception: {
                    values: [{
                        type: type,
                        value: message,
                        stacktrace: stacktrace,
                    }, ],
                },
                culprit: fileurl,
            },
            options
        );

        // Fire away!
        this._send(data);
    },

    _trimPacket: function(data) {
        // For now, we only want to truncate the two different messages
        // but this could/should be expanded to just trim everything
        var max = this._globalOptions.maxMessageLength;
        if (data.message) {
            data.message = truncate(data.message, max);
        }
        if (data.exception) {
            var exception = data.exception.values[0];
            exception.value = truncate(exception.value, max);
        }

        var request = data.request;
        if (request) {
            if (request.url) {
                request.url = redactSensitiveUrlParams(
                    truncate(request.url, this._globalOptions.maxUrlLength)
                );
            }
            if (request.Referer) {
                request.Referer = redactSensitiveUrlParams(
                    truncate(request.Referer, this._globalOptions.maxUrlLength)
                );
            }
        }

        return data;
    },

    _getHttpData: function() {
        if (!this._hasNavigator && !this._hasDocument) return;
        var httpData = {};

        if (this._hasNavigator && _navigator.userAgent) {
            httpData.headers = {
                'User-Agent': navigator.userAgent,
            };
        }

        if (this._hasDocument) {
            if (_document.location && _document.location.href) {
                httpData.url = redactSensitiveUrlParams(_document.location.href);
            }
            if (_document.referrer) {
                if (!httpData.headers) httpData.headers = {};
                httpData.headers.Referer = redactSensitiveUrlParams(_document.referrer);
            }
        }

        return httpData;
    },

    _resetBackoff: function() {
        this._backoffDuration = 0;
        this._backoffStart = null;
    },

    _shouldBackoff: function() {
        return (
            this._backoffDuration &&
            now() - this._backoffStart < this._backoffDuration
        );
    },

    /**
     * Returns true if the in-process data payload matches the signature
     * of the previously-sent data
     *
     * NOTE: This has to be done at this level because TraceKit can generate
     *       data from window.onerror WITHOUT an exception object (IE8, IE9,
     *       other old browsers). This can take the form of an "exception"
     *       data object with a single frame (derived from the onerror args).
     */
    _isRepeatData: function(current) {
        // Page events should not be de-deduped
        if (current.isPageEvent) {
            return false;
        }

        var last = this._lastData;

        if (!last ||
            current.message !== last.message || // defined for captureMessage
            current.culprit !== last.culprit // defined for captureException/onerror
        )
            return false;

        // Stacktrace interface (i.e. from captureMessage)
        if (current.stacktrace || last.stacktrace) {
            return isSameStacktrace(current.stacktrace, last.stacktrace);
        } else if (current.exception || last.exception) {
            // Exception interface (i.e. from captureException/onerror)
            return isSameException(current.exception, last.exception);
        }

        return true;
    },

    _setBackoffState: function(request) {
        // If we are already in a backoff state, don't change anything
        if (this._shouldBackoff()) {
            return;
        }

        var status = request.status;

        // 400 - project_id doesn't exist or some other fatal
        // 401 - invalid/revoked dsn
        // 429 - too many requests
        if (!(status === 400 || status === 401 || status === 429)) return;

        var retry;
        try {
            // If Retry-After is not in Access-Control-Expose-Headers, most
            // browsers will throw an exception trying to access it
            retry = request.getResponseHeader('Retry-After');
            retry = parseInt(retry, 10) * 1000; // Retry-After is returned in seconds
        } catch (e) {
            /* eslint no-empty:0 */
        }

        this._backoffDuration = retry ? // If Sentry server returned a Retry-After value, use it
            retry : // Otherwise, double the last backoff duration (starts at 1 sec)
            this._backoffDuration * 2 || 1000;

        this._backoffStart = now();
    },

    _getRecentFailedNetworkRequest: function() {
        if (this._breadcrumbs && this._breadcrumbs.length > 0) {
            // Look through recent breadcrumbs (last 10) for failed network requests
            var recentBreadcrumbs = this._breadcrumbs.slice(-10);

            for (var i = recentBreadcrumbs.length - 1; i >= 0; i--) {
                var breadcrumb = recentBreadcrumbs[i];

                // Check if this is an HTTP breadcrumb (XHR or fetch)
                if (
                    breadcrumb.type === 'http' &&
                    (breadcrumb.category === 'xhr' || breadcrumb.category === 'fetch') &&
                    breadcrumb.data &&
                    breadcrumb.data.status_code &&
                    breadcrumb.data.correlationId
                ) {
                    // Consider HTTP status codes 400+ as failed requests
                    if (breadcrumb.data.status_code >= 400) {
                        return breadcrumb.data;
                    }
                }
            }
        }

        return null;
    },

    _send: function(data) {
        var globalOptions = this._globalOptions;

        var baseData = {
                project: this._globalProject,
                logger: globalOptions.logger,
                platform: 'javascript',
            },
            httpData = this._getHttpData();

        if (httpData) {
            baseData.request = httpData;
        }

        // HACK: delete `trimHeadFrames` to prevent from appearing in outbound payload
        if (data.trimHeadFrames) delete data.trimHeadFrames;

        data = objectMerge(baseData, data);

        // Merge in the tags and extra separately since objectMerge doesn't handle a deep merge
        data.tags = objectMerge(
            objectMerge({}, this._globalContext.tags || {}),
            data.tags || {}
        );
        data.extra = objectMerge(
            objectMerge({}, this._globalContext.extra || {}),
            data.extra || {}
        );

        // Send along our own collected metadata with extra
        if (!data.extra) data.extra = {};
        data.extra['session:duration'] = now() - this._startTime;
        data.extra['sessionId'] = _window.hubspot && _window.hubspot.sessionId;

        // Capture Amplitude session ID for correlation with session replays and analytics
        try {
            if (_window.localStorage) {
                var hmplData = _window.localStorage.getItem('__hmpl');
                if (hmplData) {
                    var parsedHmplData = JSON.parse(hmplData);
                    if (parsedHmplData && parsedHmplData.session_id) {
                        data.extra['amplitudeSessionId'] = parsedHmplData.session_id;
                    }
                }
            }
        } catch (e) {}

        // Add correlation ID from recent failed network requests to extra object
        if (!data.isPageEvent &&
            this._breadcrumbs &&
            this._breadcrumbs.length > 0
        ) {
            var recentFailedRequest = this._getRecentFailedNetworkRequest();
            if (recentFailedRequest && recentFailedRequest.correlationId) {
                data.extra.correlationId = recentFailedRequest.correlationId;
            }
        }

        if (!data.isPageEvent &&
            this._breadcrumbs &&
            this._breadcrumbs.length > 0
        ) {
            // intentionally make shallow copy so that additions
            // to breadcrumbs aren't accidentally sent in this request
            data.breadcrumbs = {
                values: [].slice.call(this._breadcrumbs, 0),
            };
        }

        // If there are no tags/extra, strip the key from the payload alltogther.
        if (isEmptyObject(data.tags)) delete data.tags;

        if (this._globalContext.user) {
            // sentry.interfaces.User
            data.user = this._globalContext.user;
        }

        // Include the environment if it's defined in globalOptions
        if (globalOptions.environment) data.environment = globalOptions.environment;

        // Include the release if it's defined in globalOptions
        if (globalOptions.release) data.release = globalOptions.release;

        // Include server_name if it's defined in globalOptions
        if (globalOptions.serverName) data.server_name = globalOptions.serverName;

        if (isFunction(globalOptions.dataCallback)) {
            data = globalOptions.dataCallback(data) || data;
        }

        // Why??????????
        if (!data || isEmptyObject(data)) {
            return;
        }

        // Check if the request should be filtered or not
        if (
            isFunction(globalOptions.shouldSendCallback) &&
            !globalOptions.shouldSendCallback(data)
        ) {
            return;
        }

        // Backoff state: Sentry server previously responded w/ an error (e.g. 429 - too many requests),
        // so drop requests until "cool-off" period has elapsed.
        if (this._shouldBackoff()) {
            this._logDebug('warn', 'Raven dropped error due to backoff: ', data);
            return;
        }

        if (typeof globalOptions.sampleRate === 'number') {
            if (Math.random() < globalOptions.sampleRate) {
                this._sendProcessedPayload(data);
            }
        } else {
            this._sendProcessedPayload(data);
        }
    },

    _getUuid: function() {
        return uuid4();
    },

    _sendProcessedPayload: function(data, callback) {
        var self = this;
        var globalOptions = this._globalOptions;

        if (!this.isSetup()) return;

        // Try and clean up the packet before sending by truncating long values
        data = this._trimPacket(data);

        // ideally duplicate error testing should occur *before* dataCallback/shouldSendCallback,
        // but this would require copying an un-truncated copy of the data packet, which can be
        // arbitrarily deep (extra_data) -- could be worthwhile? will revisit
        if (!this._globalOptions.allowDuplicates && this._isRepeatData(data)) {
            this._logDebug('warn', 'Raven dropped repeat event: ', data);
            return;
        }

        // Send along an event_id if not explicitly passed.
        // This event_id can be used to reference the error within Sentry itself.
        // Set lastEventId after we know the error should actually be sent
        this._lastEventId = data.event_id || (data.event_id = this._getUuid());

        // Store outbound payload after trim
        this._lastData = data;

        this._logDebug('debug', 'Raven about to send:', data);

        var auth = {
            sentry_version: '7',
            sentry_client: 'raven-js/' + this.VERSION,
        };

        if (this._globalKey) {
            auth.sentry_key = this._globalKey;
        }

        if (this._globalSecret) {
            auth.sentry_secret = this._globalSecret;
        }

        var params = {};
        var hasProjectTag = data.tags && data.tags.project;
        var hasParams = hasProjectTag;

        if (hasProjectTag) {
            params.deployable = data.tags.project;
        }

        var exception = data.exception && data.exception.values[0];
        this.captureBreadcrumb({
            category: data.isPageEvent ? 'pageEvent' : 'sentry',
            message: exception ?
                (exception.type ? exception.type + ': ' : '') + exception.value :
                data.message,
            data: data.isPageEvent ? data.extra : undefined,
            event_id: data.event_id,
            level: data.level || 'error', // presume error unless specified
        });

        var url = data.isPageEvent ?
            this._globalPageEventEndpoint :
            this._globalEndpoint;

        (globalOptions.transport || this._makeRequest).call(this, {
            url: url,
            auth: auth,
            query: hasParams ? params : undefined,
            data: data,
            options: globalOptions,
            onSuccess: function success() {
                self._resetBackoff();

                self._triggerEvent('success', {
                    data: data,
                    src: url,
                });
                callback && callback();
            },
            onError: function failure(error) {
                self._logDebug('error', 'Raven transport failed to send: ', error);

                if (error.request) {
                    self._setBackoffState(error.request);
                }

                self._triggerEvent('failure', {
                    data: data,
                    src: url,
                    error,
                });
                error =
                    error ||
                    new Error('Raven send failed (no additional details provided)');
                callback && callback(error);
            },
        });
    },

    _makeRequest: function(opts) {
        var request = _window.XMLHttpRequest && new _window.XMLHttpRequest();
        if (!request) return;

        // if browser doesn't support CORS (e.g. IE7), we are out of luck
        var hasCORS =
            'withCredentials' in request || typeof XDomainRequest !== 'undefined';

        if (!hasCORS) return;

        var url = opts.url;

        if ('withCredentials' in request) {
            request.onreadystatechange = function() {
                if (request.readyState !== 4) {
                    return;
                } else if (request.status === 200) {
                    opts.onSuccess && opts.onSuccess();
                } else if (opts.onError) {
                    var err = new Error('Sentry error code: ' + request.status);
                    err.request = request;
                    opts.onError(err);
                }
            };
        } else {
            request = new XDomainRequest();
            // xdomainrequest cannot go http -> https (or vice versa),
            // so always use protocol relative
            url = url.replace(/^https?:/, '');

            // onreadystatechange not supported by XDomainRequest
            if (opts.onSuccess) {
                request.onload = opts.onSuccess;
            }
            if (opts.onError) {
                request.onerror = function() {
                    var err = new Error('Sentry error code: XDomainRequest');
                    err.request = request;
                    opts.onError(err);
                };
            }
        }

        // NOTE: auth is intentionally sent as part of query string (NOT as custom
        //       HTTP header) so as to avoid preflight CORS requests
        try {
            request.open(
                'POST',
                `${url}?${urlencode(opts.auth)}${
          opts.query ? `&${urlencode(opts.query)}` : ''
        }`
            );
            request.send(stringify(opts.data));
        } catch (e) {
            // Handle "Document is not fully active" error when XMLHttpRequest operations
            // are called on inactive documents (e.g., removed iframes)
            if (opts.onError) {
                var err = new Error('XMLHttpRequest failed: ' + e.message);
                err.request = request;
                err.originalError = e;
                opts.onError(err);
            }
        }
    },

    _logDebug: function(level) {
        if (this._originalConsoleMethods[level] && this.debug) {
            // In IE<10 console methods do not have their own 'apply' method
            Function.prototype.apply.call(
                this._originalConsoleMethods[level],
                this._originalConsole, [].slice.call(arguments, 1)
            );
        }
    },

    _mergeContext: function(key, context) {
        if (isUndefined(context)) {
            delete this._globalContext[key];
        } else {
            this._globalContext[key] = objectMerge(
                this._globalContext[key] || {},
                context
            );
        }
    },
};

// Deprecations
Raven.prototype.setUser = Raven.prototype.setUserContext;
Raven.prototype.setReleaseContext = Raven.prototype.setRelease;