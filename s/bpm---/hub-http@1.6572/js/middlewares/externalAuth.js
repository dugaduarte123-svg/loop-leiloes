'use es6';

import {
    cookieAuthentication
} from './cookieAuth';
const domainsConfig = [{
    csrfCookieName: 'csrf.api',
    matcher: /^[a-z0-9-]+\.hubapi(qa)?\.com$/
}, {
    csrfCookieName: 'csrf.app',
    matcher: /^[a-z0-9-]+\.hubspot(qa)?\.com$/
}];
const externalCookieAuthentication = cookieAuthentication(domainsConfig);
export {
    externalCookieAuthentication as cookieAuthentication
};