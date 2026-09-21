/* hs-eslint ignored failing-rules */
/* eslint-disable prefer-const */
/* eslint-disable no-prototype-builtins */
/* eslint-disable consistent-return */
/* eslint-disable one-var */

'use es6';

import I18n from 'I18n';
import {
    DEFAULT_OPTIONS
} from './DefaultOptions';
import {
    logKeyUsage
} from './performanceHelpers';
import {
    isSet
} from './miscHelpers';

// Merge serveral hash options, checking if value is set before
// overwriting any value. The precedence is from left to right.
//
//     I18n.prepareOptions({name: "John Doe"}, {name: "Mary Doe", role: "user"});
//     #=> {name: "John Doe", role: "user"}
//
export const prepareOptions = function prepareOptions(...args) {
    const options = {};
    while (args.length) {
        let subject = args.shift();
        if (typeof subject !== 'object') {
            continue;
        }
        for (const attr in subject) {
            if (!subject.hasOwnProperty(attr)) {
                continue;
            }
            if (isSet(options[attr])) {
                continue;
            }
            options[attr] = subject[attr];
        }
    }
    return options;
};
export const getFullScope = function getFullScope(scope, options) {
    options = prepareOptions(options);

    // Deal with the scope as an array.
    if (scope.constructor === Array) {
        scope = scope.join(DEFAULT_OPTIONS.defaultSeparator);
    }

    // Deal with the scope option provided through the second argument.
    //
    //    I18n.t('hello', {scope: 'greetings'});
    //
    if (options.scope) {
        scope = [options.scope, scope].join(DEFAULT_OPTIONS.defaultSeparator);
    }
    return scope;
};

// Return current locale. If no locale has been set, then
// the current locale will be the default locale.
export const currentLocale = function currentLocale() {
    return I18n.locale || DEFAULT_OPTIONS.defaultLocale;
};

// Find and process the translation using the provided scope and options.
// This is used internally by some functions and should not be used as an
// public API.
export const lookup = function lookup(scope, options) {
    options = prepareOptions(options);
    const locales = I18n.locales.get(options.locale).slice();
    const requestedLocale = locales[0];
    let locale, scopes, translations, requestedLocaleValue;
    scope = getFullScope(scope, options);
    while (locales.length) {
        locale = locales.shift();
        scopes = scope.split(DEFAULT_OPTIONS.defaultSeparator);
        translations = I18n.translations[locale];
        if (!translations) {
            continue;
        }
        while (scopes.length) {
            translations = translations[scopes.shift()];
            if (translations === undefined || translations === null) {
                break;
            }
        }
        const getJustLangValue = function getJustLangValue(loc) {
            return loc.split('-')[0];
        };
        requestedLocaleValue = getJustLangValue(requestedLocale);
        if (translations !== undefined && translations !== null) {
            // HubSpot logic to track key usage and English fallback
            const translationLocaleFound = getJustLangValue(locale);
            const isNotRequestedLocale = requestedLocaleValue !== translationLocaleFound;
            const isFallbackLocale = translationLocaleFound === DEFAULT_OPTIONS.defaultLocale;
            logKeyUsage(scope, I18n.langEnabled && isNotRequestedLocale && isFallbackLocale, requestedLocaleValue);
            // End HubSpot logic to track English fallback
            return translations;
        }
    }

    // Custom HubSpot logic to log key usage
    logKeyUsage(scope, false, requestedLocaleValue);
    if (isSet(options.defaultValue)) {
        return options.defaultValue;
    }
};