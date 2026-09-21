/* hs-eslint ignored failing-rules */
/* eslint-disable prefer-template */

'use es6';

import I18n from 'I18n';
import {
    DEFAULT_OPTIONS
} from './DefaultOptions';
import {
    getFullScope,
    currentLocale
} from './translateHelpers';
import {
    htmlEscape
} from './miscHelpers';
import {
    Metrics
} from '../Metrics';
import getLang from 'I18n/utils/getLang';
const MISSING_NOTIFICATIONS = [];

// Return a missing placeholder message for given parameters
const missingPlaceholderInitial = function missingPlaceholderInitial(placeholder) {
    return '[missing ' + placeholder + ' value]';
};
export const nullPlaceholder = function nullPlaceholder(...args) {
    return missingPlaceholderInitial(args);
};
const missingNotificationWrapper = function missingNotificationWrapper(originalFunction, eventName, errorMetricName, originalArgs, sentryOptions) {
    if (sentryOptions == null) {
        sentryOptions = {};
    }
    const message = originalFunction.apply(I18n, originalArgs);
    const sentryMessage = sentryOptions.message || message;
    if (MISSING_NOTIFICATIONS.indexOf(sentryMessage) < 0) {
        MISSING_NOTIFICATIONS.push(sentryMessage);
        Metrics.counter(errorMetricName).increment();
        const topLevelKey = sentryOptions.translationKey ? sentryOptions.translationKey.split('.')[0] : null;
        const localeTranslations = I18n.translations[getLang()] || {};
        const chunkMayHaveFailedToLoad = I18n.hasHadLoadingFailure && topLevelKey && !localeTranslations[topLevelKey];
        const missingNotificationError = new Error(chunkMayHaveFailedToLoad ? `I18n: Missing translation namespace: ${topLevelKey}` : `I18n: ${sentryMessage}`);
        const extraErrorMetadata = {
            i18nErrorType: eventName,
            currentLocale: I18n.langEnabled ? I18n.locale : 'en-us',
            translationKey: sentryOptions.translationKey,
            placeholderName: sentryOptions.placeholderName,
            hasHadLoadingFailure: I18n.hasHadLoadingFailure
        };
        if (window.Raven) {
            const ravenOptions = {
                extra: extraErrorMetadata
            };
            if (chunkMayHaveFailedToLoad) {
                ravenOptions.fingerprint = ['i18n-chunk-load-failure', topLevelKey];
            }
            window.Raven.captureException(missingNotificationError, ravenOptions);
        }
    }

    // Trigger event if in browser context (trigger not currently around in node/schablone)
    if (typeof I18n.trigger === 'function') {
        I18n.trigger(eventName, message);
    }
    return message;
};
const originalMissingTranslation = function originalMissingTranslation(scope, options) {
    //guess intended string
    if (I18n.missingBehaviour === 'guess') {
        //get only the last portion of the scope
        const s = scope.split('.').slice(-1)[0];
        //replace underscore with space && camelcase with space and lowercase letter
        return (DEFAULT_OPTIONS.missingTranslationPrefix.length > 0 ? DEFAULT_OPTIONS.missingTranslationPrefix : '') + s.replace('_', ' ').replace(/([a-z])([A-Z])/g, (match, p1, p2) => {
            return p1 + ' ' + p2.toLowerCase();
        });
    }
    const fullScope = getFullScope(scope, options);
    const fullScopeWithLocale = [currentLocale(), fullScope].join(DEFAULT_OPTIONS.defaultSeparator);
    return '[missing “' + fullScopeWithLocale + '” translation]';
};
export const missingTranslation = function missingTranslation(scope) {
    const missingTranslationMessage = 'Missing translation: "' + scope + '"';
    console.warn(`I18n: ${missingTranslationMessage}`);
    const sentryOptions = {
        translationKey: scope,
        message: missingTranslationMessage
    };
    return htmlEscape(missingNotificationWrapper(originalMissingTranslation, 'missingTranslation', 'translate-request-key-missing-translation', [scope], sentryOptions));
};
const originalMissingValue = missingPlaceholderInitial;
export const missingPlaceholder = function missingPlaceholder(placeholder, message, options) {
    const missingPlaceholderMessage = `Missing placeholder: ${placeholder} in "${options.__scope}"`;
    const sentryOptions = {
        message: missingPlaceholderMessage,
        translationKey: options.__scope,
        placeholderName: placeholder
    };
    console.warn(`I18n: ${missingPlaceholderMessage}`);
    return missingNotificationWrapper(originalMissingValue, 'missingPlaceholder', 'translate-request-key-missing-placeholder', [placeholder, message, options], sentryOptions);
};