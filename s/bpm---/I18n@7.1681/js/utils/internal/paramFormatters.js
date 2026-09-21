'use es6';

import I18n from 'I18n';
import {
    formatNumber
} from './numberFormatters';
import {
    htmlEscape
} from './miscHelpers';
export const formatParam = function formatParam(optName, optValue) {
    if (typeof optValue === 'number') {
        if (isNaN(optValue)) {
            return null; // don't display NaN
        }
        if (optName === 'count') {
            return Number(optValue);
        }
        if (optName.toLowerCase() === 'portalid') {
            console.warn('The use of params named "portalId" in externalized strings is deprecated. You should wrap it, like so "I18n.t(key, { portalId: I18n.SafeString(portalId) })", to prevent it from being automatically formatted. See HubSpot/I18n#109');
            return String(optValue);
        } else {
            return formatNumber(optValue);
        }
    } else if (optValue instanceof I18n.SafeString) {
        return optValue.toString();
    } else if (optValue != null) {
        return htmlEscape(String(optValue));
    } else {
        return optValue;
    }
};