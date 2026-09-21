'use es6';

import {
    parseUrl
} from '../helpers/url';
import {
    Metrics
} from './metrics';
import {
    isAcceptanceTest
} from '../helpers/env';
import enviro from 'enviro';
const HARVEST_DELAY = 1000 * 10;
const AJAX_QUEUE = new Set();
const AT_FLUSH_KEY = '__hub_http_flushed';

// Chrome 149 (stable channel) no longer delivers console messages emitted during
// the page unload phase to ChromeDriver's log buffer. Instead, use sessionStorage
// as a cross-navigation signal: set a key during visibilitychange, then read it
// on the next load and expose it as a DOM attribute that ATs can assert on.
if (isAcceptanceTest()) {
    try {
        if (sessionStorage.getItem(AT_FLUSH_KEY)) {
            sessionStorage.removeItem(AT_FLUSH_KEY);
            document.documentElement.setAttribute('data-hub-http-flushed', 'true');
        }
    } catch (e) {
        // ignore
    }
}

// We are properly handling cases where this API is undefined.
// eslint-disable-next-line compat/compat
const trackRequests = Boolean(navigator.sendBeacon);
let flushRequestsTimeout = undefined;
let hasEnabledSendOnVisibilityChange = false;
const getPerfData = windowObj => {
    const entries = windowObj.performance.getEntriesByType('resource');
    if (!entries || !entries.length) {
        return {};
    }
    const requests = entries.filter(res => res.initiatorType === 'xmlhttprequest');
    const entryMap = {};
    requests.forEach(({
        name,
        duration,
        requestStart,
        responseStart,
        transferSize
    }) => {
        if (!entryMap[name]) {
            entryMap[name] = [];
        }
        entryMap[name].push({
            duration,
            transferSize,
            serverTime: responseStart - requestStart,
            requestStart
        });
    });
    return entryMap;
};
const findPerfData = (requestDataForUrl, requestSendTime) => {
    if (!requestDataForUrl) {
        return {};
    }
    const requestData = requestDataForUrl.filter(perfData => {
        return requestSendTime - perfData.requestStart < 10;
    });
    return requestData.length ? requestData[0] : {};
};
const send = () => {
    try {
        if (AJAX_QUEUE.size === 0) {
            return;
        }
        const ajaxData = [...AJAX_QUEUE];
        AJAX_QUEUE.clear();
        let iframeData = {};
        let apiIframeUsed;
        try {
            apiIframeUsed =
                // see https://git.hubteam.com/HubSpot/hub-http/pull/372
                window.apiIframeUsed && window.apiIframe && window.apiIframe.contentWindow;
            iframeData = apiIframeUsed ? getPerfData(window.apiIframe.contentWindow) : {};
        } catch (e) {
            // Skip iframe data
        }
        let currentWindowPerfData = {};
        try {
            currentWindowPerfData = getPerfData(window);
        } catch (e) {
            // Skip current window data
        }
        const requestPerfData = Object.assign({}, currentWindowPerfData, iframeData);
        const hydratedRequests = ajaxData.map(({
            url,
            sendTime,
            statusCode,
            statusDesc
        }) => {
            const metadataForRequest = {
                url,
                statusCode
            };
            if (statusDesc) {
                metadataForRequest.statusDesc = statusDesc;
            }
            const perfDataForRequest = findPerfData(requestPerfData[url], sendTime);
            return Object.assign({}, metadataForRequest, perfDataForRequest);
        });

        // sendBeacon will never be called if trackRequests (existence check on sendBeacon API) is false
        // eslint-disable-next-line compat/compat
        const sent = navigator.sendBeacon(getMetricsUrl(), JSON.stringify({
            datapoints: hydratedRequests
        }));
        if (!sent) {
            ajaxData.forEach(request => AJAX_QUEUE.add(request));
        }
    } catch (sendError) {
        // Don't do anything if this fails.
    }
};
export const reportStatusCode = requestStatus => {
    if (!trackRequests) {
        return;
    }
    AJAX_QUEUE.add(requestStatus);
    clearTimeout(flushRequestsTimeout);
    if (AJAX_QUEUE.size >= 25) {
        send();
    }
    flushRequestsTimeout = setTimeout(send, HARVEST_DELAY);
    if (!hasEnabledSendOnVisibilityChange) {
        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                if (isAcceptanceTest()) {
                    try {
                        sessionStorage.setItem(AT_FLUSH_KEY, '1');
                    } catch (e) {
                        // ignore
                    }
                }
                send();
            }
        }, false);
        hasEnabledSendOnVisibilityChange = true;
    }
};
export const reportDomain = url => {
    if (typeof url !== 'string') return;
    try {
        const {
            hostname
        } = parseUrl(url);
        const [subdomain, domain, tld] = hostname.split('.');
        Metrics.counter('request-sent', {
            hostname: [subdomain.replace(/\d+/, ''), domain.replace(/qa$/, ''), tld].join('.'),
            prom_only: 'true'
        }).increment();
    } catch (err) {
        // can't do much here if we get a domain that isn't actually a domain, ignore
    }
};

function getMetricsUrl() {
    return `https://metrics-fe-${enviro.getHublet()}.hubspot${enviro.isQa() ? 'qa' : ''}.com/metrics/v1/frontend/send`;
}