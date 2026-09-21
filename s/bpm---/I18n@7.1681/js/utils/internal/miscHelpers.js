'use es6';

// htmlEscape utility function based on Underscore's _.escape
const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
};
const htmlCharPattern = '(?:&|<|>|"|\'|`)';
const htmlTestRegexp = RegExp(htmlCharPattern);
const htmlReplaceRegexp = RegExp(htmlCharPattern, 'g');
const htmlReplacement = match => htmlEscapeMap[match];
export const htmlEscape = function htmlEscape(string) {
    if (htmlTestRegexp.test(string)) {
        return string.replace(htmlReplaceRegexp, htmlReplacement);
    } else {
        return string;
    }
};

// Check if value is different than undefined and null;
export const isSet = function isSet(value) {
    return value !== undefined && value !== null;
};

// Steal Underscore's isObject implementation to deal with node not correctly respecting
// `x instanceof Object` across different requires.
export const isObject = function isObject(obj) {
    return obj === Object(obj);
};