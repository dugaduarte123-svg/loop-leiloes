/* hs-eslint ignored failing-rules */
/* eslint-disable prefer-const */
/* eslint-disable no-prototype-builtins */

'use es6';

import I18n from 'I18n';
import {
    Metrics
} from '../Metrics';
import {
    translate as text
} from './i18nHelpers';
import {
    formatParam
} from './paramFormatters';
export const translate = function translate(...args) {
    const lastOption = args[args.length - 1];
    const includesOptions = typeof lastOption !== 'string';
    const originalOpts = includesOptions && lastOption ? args[args.length - 1] : {};
    const key = includesOptions ? args.slice(0, args.length - 1).join('.') : args.join('.');
    const modifiedOpts = {};

    // Copy originalOpts to modifiedOpts, formatting numeric params and escaping others along the way
    for (let optName in originalOpts) {
        if (originalOpts.hasOwnProperty(optName)) {
            const optValue = originalOpts[optName];
            if (optValue != null) {
                modifiedOpts[optName] = formatParam(optName, optValue);
            }
        }
    }
    if (!modifiedOpts.locale && I18n.locale.split('-')[0] !== 'en' && !I18n.langEnabled && !I18n.publicPage) {
        // TEST - I18n.debugLog('Forcing translation in English, lang is not enabled');
        modifiedOpts.locale = 'en';
    }

    // Attach the translation key to the options object for missingPlaceholder
    modifiedOpts.__scope = key;

    // Warn if I18n isn't ready yet (#296)
    if (I18n.fired && !I18n.fired.ready) {
        const tooEarlyError = new Error(`I18n.text called before ready with key '${key}' - See go/i18n-help for more info`);
        setTimeout(() => {
            Metrics.counter('translate-request-fired-too-early').increment();
            throw tooEarlyError;
        }, 0);
    }
    return text(key, modifiedOpts);
};