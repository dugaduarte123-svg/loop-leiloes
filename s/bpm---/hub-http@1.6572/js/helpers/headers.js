/* hs-eslint ignored failing-rules */
/* eslint-disable no-prototype-builtins */

'use es6';

import {
    setIn
} from './update';
export const getHeader = (name, responseOrOptions) => {
    const headers = responseOrOptions.headers;
    if (!headers) {
        return undefined;
    }
    for (const header in headers) {
        if (headers.hasOwnProperty(header) && header.toLowerCase() === name.toLowerCase()) {
            return headers[header];
        }
    }
    return undefined;
};
export const setHeader = (name, value, options) => {
    const headers = options.headers;
    for (const header in headers) {
        if (headers.hasOwnProperty(header) && header.toLowerCase() === name.toLowerCase()) {
            return setIn(['headers', header], value)(options);
        }
    }
    return setIn(['headers', name], value)(options);
};