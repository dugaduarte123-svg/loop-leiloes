'use es6';

// src derived from https://underscorejs.org/docs/underscore.html#section-176
const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
};
const source = `(?:${Object.keys(escapeMap).join('|')})`;
const testRegexp = RegExp(source);
const replaceRegexp = RegExp(source, 'g');
export function escape(input) {
    input = input == null ? '' : `${input}`;
    return testRegexp.test(input) ? input.replace(replaceRegexp, match => escapeMap[match]) : input;
}