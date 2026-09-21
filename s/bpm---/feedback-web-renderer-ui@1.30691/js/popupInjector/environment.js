'use es6';

import getAttribute from '../utils/getAttribute';
const LIVE_PREVIEW_QUERY_PARAM_KEY = 'hsWebSurveyPreview';
const LIVE_PREVIEW_ID_QUERY_PARAM_KEY = 'hsWebSurveyTestId';
const PORTAL_ID_ATTR = 'data-hubspot-feedback-portal-id';
const CUSTOMER_PORTAL_ID_ATTR = 'data-hubspot-feedback-customer-portal-id';
const ENV_ATTR = 'data-hubspot-feedback-env';
const HUBSPOT_APP_ATTR = 'data-hubspot-feedback-hubspot-app';
const HUBSPOT_EMAIL_ATTR = 'data-hubspot-feedback-hubspot-email';
const HUBSPOT_USER_LANG = 'data-hubspot-feedback-user-lang';
const HUBSPOT_CLIENT_LOAD_ONLY = 'data-hubspot-feedback-client-load-only';
const HUBLET = 'data-hsjs-hublet';
const queryParams = {};
const hash = window.location.hash;
const search = window.location.search;
const getParams = () => {
    if (hash.length > 0) {
        const split = hash.split('?');
        if (split.length > 1) {
            return `?${split[1]}`;
        }
    }
    return search;
};
getParams().replace(/[(?|&)]([^=]+)=([^&#]+)/g, (_, key, value) => {
    queryParams[key] = value;
});
const getKey = key => {
    try {
        return localStorage.getItem(key) === 'true';
    } catch (e) {
        return false;
    }
};
export function getHubletFromUrl() {
    const subdomain = window.location.hostname.split('.')[0];
    const hublet = subdomain.split('-')[1];
    return hublet || '';
}
export const env = getAttribute(ENV_ATTR);
export const portalId = getAttribute(PORTAL_ID_ATTR);
export const customerPortalId = getAttribute(CUSTOMER_PORTAL_ID_ATTR);
export const livePreview = queryParams[LIVE_PREVIEW_QUERY_PARAM_KEY];
export const livePreviewId = queryParams[LIVE_PREVIEW_ID_QUERY_PARAM_KEY];
export const isTest = Boolean(window.feedbackTestPage) || Boolean(livePreview);
export const isPreview = Boolean(window.hsFeedbackPreview);
export const isHubspot = Boolean(getAttribute(HUBSPOT_APP_ATTR));
export const hsEmail = getAttribute(HUBSPOT_EMAIL_ATTR);
export const hsUserLang = getAttribute(HUBSPOT_USER_LANG);
export const hublet = getAttribute(HUBLET) || getHubletFromUrl();
export const clientLoadOnly = getAttribute(HUBSPOT_CLIENT_LOAD_ONLY) === 'true';
export const useLocalRenderer = getKey('LOCAL_RENDERER');
export const isUnsupportedBrowser = /MSIE\s/.test(navigator.userAgent) && parseFloat(navigator.appVersion.split('MSIE')[1]) < 11;
export const isBot = /bot|python-requests|hubspot|phantomjs|bingpreview/i.test(navigator.userAgent);
export const liveTest = /hsWebSurveyTestId/.test(document.referrer);
if (useLocalRenderer) {
    const container = document.querySelector('body');
    const tag = document.createElement('div');
    tag.setAttribute('class', 'UIRibbon-sc-1wnhcos-0 hwuPWx');
    tag.innerText = 'Web renderer local';
    tag.style.top = '130px';
    tag.style.zIndex = 5;
    container.appendChild(tag);
}