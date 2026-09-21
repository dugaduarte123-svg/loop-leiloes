'use es6';

import getHubletSuffix from '../utils/getHubletSuffix';
import * as Env from '../utils/environment';
import {
    toQueryParams
} from 'feedback-utils/urls';
import {
    UI,
    PREVIEW_EDITOR,
    FETCHER,
    PREVIEW_UI
} from 'feedback-schema/constants/messageChannels';
import {
    SURVEY_FETCHED,
    SETUP,
    SHOW,
    UPDATE,
    FOCUS,
    READY,
    EXPAND,
    HIDE,
    RESIZE_POPUP,
    LOCATION_CHANGE,
    CONFIG_FETCHED
} from 'feedback-schema/constants/messageTypes';
import {
    iframeSender,
    parentSender,
    onFrameReady
} from 'feedback-utils/messages';
import {
    parentListener
} from 'feedback-utils/subscriptions/messages';
import urlChangePoller from 'feedback-utils/subscriptions/urlPoller';
import eventAggregator from 'feedback-utils/subscriptions/events';
import {
    STANDARD,
    LIVE_PREVIEW,
    PREVIEW
} from '../constants/modes';
import {
    FETCHER as PATH_FETCHER,
    UI as PATH_UI
} from '../constants/paths';
import FeedbackWebClient from '../popupInjector/client';
import {
    livePreview,
    portalId,
    isTest,
    isPreview,
    useLocalRenderer,
    env,
    hsUserLang,
    isHubspot,
    isBot,
    isUnsupportedBrowser,
    livePreviewId,
    hsEmail,
    customerPortalId,
    hublet,
    clientLoadOnly
} from '../popupInjector/environment';
import injectStyle from '../popupInjector/injectStyle';
import * as Style from '../popupInjector/style';
import * as DOM from '../utils/dom';
import post from '../utils/http/post';
import {
    buildAuthHeaders,
    getBaseFeedbackAuthUrl
} from '../utils/auth';
import {
    SurveyTypeEnum
} from '../constants/surveyTypes';

// eslint-disable-next-line hubspot-dev/no-confusing-browser-globals
const getLocation = () => location;
const getInnerWidth = () => {
    try {
        // Catch browser security errors in case the parent/top window is cross-origin, and fallback to current innerWidth
        // eslint-disable-next-line hubspot-dev/no-confusing-browser-globals
        return window.top.innerWidth;
    } catch (__error) {
        // eslint-disable-next-line hubspot-dev/no-confusing-browser-globals
        return innerWidth;
    }
};
injectStyle(Style.baseStyleSheet);
const hsq = window._hsq = window._hsq || [];
const uiSetup = {
    portalId,
    isPreview,
    isTest
};
const suffix = getHubletSuffix(hublet);
const frameOrigin = `https://${isPreview && /local/.test(getLocation().origin) || useLocalRenderer ? 'local' : 'app'}${suffix}.hubspot${env === 'prod' ? '' : 'qa'}.com`;
const frames = {};
let client;
let csatSurveyTitle = '';
if (!window.hsFeedbackLoaded) {
    client = new FeedbackWebClient();
}
const BASE_FEEDBACK_AUTH_URL = getBaseFeedbackAuthUrl(env !== 'prod');

// Track when a CSAT survey is shown (for rate limiting)
const trackShownCSAT = (surveyId, callback = () => {}) => {
    const BASE_AUTH_URL = `https://api${suffix}.${BASE_FEEDBACK_AUTH_URL}/v1`;
    const params = {
        bundleVersion: Env.bundleVersion,
        portalId: customerPortalId || portalId
    };
    post(`${BASE_AUTH_URL}/survey-config/CSAT/${surveyId}/shown?${toQueryParams(params)}`, callback, {
        headers: buildAuthHeaders(),
        withCredentials: true
    });
};
const trackNudgeRenderedWithAmplitude = (title, callback = () => {}) => {
    try {
        const BASE_NUDGE_TRACKING_URL = `https://api${suffix}.hubspot${env === 'prod' ? '' : 'qa'}.com`;
        const location = getLocation();
        const url = new URL(location.href);
        post(`${BASE_NUDGE_TRACKING_URL}/nudge/tracking/v1/nudge-event?portalId=${portalId}`, callback, {
            headers: buildAuthHeaders(),
            withCredentials: true,
            data: {
                nudgeEvents: [{
                    app_name: url.pathname.split('/').filter(Boolean)[0] || '',
                    event_timestamp: Date.now(),
                    from_automated_test: document.cookie.includes('hs_selenium'),
                    locale: document.documentElement.lang || 'en-us',
                    nudge: {
                        type: 'POPUP_CSAT',
                        title: title || 'no-title',
                        id: 'csat-feedback-survey'
                    },
                    session_id: window.hubspot && window.hubspot.sessionId || '',
                    type: 'EXTERNAL_RENDERED',
                    url: `${url.host}${url.pathname}`,
                    xpath: ''
                }]
            }
        });
    } catch (_error) {
        // non-critical tracking, do not propagate
    }
};
const handleFetcherMessages = (messageType, response) => {
    switch (messageType) {
        case SURVEY_FETCHED:
            csatSurveyTitle = response && response.config && response.config.question || '';
            // eslint-disable-next-line no-use-before-define
            sendMessage(UI, SETUP, {
                mode: STANDARD,
                payload: {
                    isHubspot,
                    portalId,
                    response,
                    pageTitle: document.title,
                    // eslint-disable-next-line hubspot-dev/no-confusing-browser-globals
                    pageUrl: location.href,
                    utk: uiSetup.utk,
                    windowWidth: getInnerWidth(),
                    hublet,
                    clientLoadOnly
                }
            });
            client._onSurveyLoaded(response);
            break;
        case CONFIG_FETCHED:
            client._onConfigLoaded(response);
            break;
        default:
            break;
    }
};
const isShown = () => {
    const fn = frames[UI];
    return fn && fn.data && fn.data.parent.className.indexOf(Style.SHOWN_CLASS) >= 0;
};
const sendToEditor = parentSender(PREVIEW_EDITOR);
const handleUIMessages = (messageType, payload) => {
    // eslint-disable-next-line no-use-before-define
    getReadyFrame(UI, ({
        parent
    }) => {
        switch (messageType) {
            case SHOW:
                {
                    const {
                        classes,
                        displayOnScroll,
                        surveyId,
                        surveyLanguage,
                        surveyType,
                        userLocale
                    } = payload;
                    const userLanguage = hsUserLang || userLocale;
                    if (isHubspot && surveyLanguage !== userLanguage || window.disabledHsPopups && window.disabledHsPopups.indexOf('FEEDBACK') > -1) {
                        return;
                    }
                    const baseClasses = [...classes, ...(isPreview ? ['preview'] : [])].join(' ').toLowerCase();
                    if (!livePreview && surveyId !== undefined) {
                        hsq.push(['trackFeedbackView', {
                            surveyId,
                            surveyType
                        }]);
                    }
                    parent.baseClasses = baseClasses;
                    parent.className = baseClasses;
                    if (displayOnScroll) {
                        client.showOnScroll();
                    } else {
                        client.show();
                    }

                    // Track shown event only for CSAT surveys on HubSpot URLs (rate limiting)
                    if (surveyType === SurveyTypeEnum.CSAT && isHubspot) {
                        trackShownCSAT(surveyId);
                        trackNudgeRenderedWithAmplitude(csatSurveyTitle);
                    }
                    break;
                }
            case EXPAND:
                {
                    if (payload) {
                        DOM.addClass(parent, Style.EXPANDED_CLASS);
                    } else {
                        DOM.removeClass(parent, Style.EXPANDED_CLASS);
                    }
                    sendToEditor(messageType, payload);
                    break;
                }
            case HIDE:
                client.hide();
                setTimeout(() => {
                    parent.className = parent.baseClasses;
                }, 1000);
                break;
            case RESIZE_POPUP:
                {
                    const {
                        newHeight,
                        newWidth
                    } = payload;
                    parent.style.width = newWidth ? `${newWidth}px` : null;
                    parent.style.height = `${newHeight}px`;
                    break;
                }
            default:
                sendToEditor(messageType, payload);
                break;
        }
    });
};
const onFetcherInit = ({
    sender
}) => {
    urlChangePoller(url => {
        if (isShown()) return;
        sender(LOCATION_CHANGE, url);
    });
};
const syncUI = sender => () => {
    sender(UPDATE, {
        pageTitle: document.title,
        pageUrl: getLocation().href,
        windowWidth: getInnerWidth()
    });
};
const onUIInit = params => {
    const {
        sender
    } = params;
    const syncer = syncUI(sender);
    urlChangePoller(syncer);
    eventAggregator(window, 'resize')(syncer);
    eventAggregator(document, 'focus')(() => {
        sender(FOCUS);
    });
    client.initialiseUI(params);
    return {
        client
    };
};
const frameConfigs = {
    FETCHER: {
        onInit: onFetcherInit,
        handleMessages: handleFetcherMessages,
        parentAttrs: {
            id: Style.FETCHER_ID,
            title: 'submit hubspot feedback'
        },
        path: PATH_FETCHER
    },
    UI: {
        onInit: onUIInit,
        handleMessages: handleUIMessages,
        parentAttrs: {
            id: Style.UI_ID,
            title: 'submit hubspot feedback'
        },
        path: PATH_UI
    }
};
const injectFrame = channel => {
    const {
        path,
        parentAttrs
    } = frameConfigs[channel];
    const frame = DOM.createNode('iframe', {
        frameborder: 0,
        title: 'Submit HubSpot product feedback',
        src: `${frameOrigin}/${path}`
    });
    const parent = DOM.createNode('div', parentAttrs);
    DOM.insertNode(parent, frame);
    DOM.insertNode(document.body, parent);
    return [frame, parent];
};
const getReadyFrame = (channel, callback) => {
    if (frames[channel]) {
        frames[channel](callback);
        return;
    }
    const backlog = [callback];
    frames[channel] = fn => {
        backlog.push(fn);
    };
    const [frame, parent] = injectFrame(channel);
    onFrameReady(frame, channel, ({
        sender,
        subscribe
    }) => {
        const {
            handleMessages,
            onInit
        } = frameConfigs[channel];
        subscribe(handleMessages);
        let params = {
            frame,
            parent,
            subscribe,
            sender
        };
        params = Object.assign({}, params, onInit(params) || {});
        const caller = fn => {
            fn(params);
        };
        frames[channel] = caller;
        caller.data = params;
        backlog.forEach(frames[channel]);
    });
};
const sendMessage = (channel, messageType, payload = {}) => {
    getReadyFrame(channel, ({
        sender
    }) => {
        sender(messageType, payload);
    });
};
const tunnelPreview = ({
    frame
}) => {
    const sender = iframeSender(frame, PREVIEW_UI);
    parentListener(PREVIEW_EDITOR)(sender);
    sendToEditor(READY);
};
if (!(isBot || isUnsupportedBrowser) && !window.hsFeedbackLoaded) {
    if (livePreview || isPreview) {
        let mode;
        let payload = {
            pageUrl: getLocation().href
        };
        getReadyFrame(UI, params => {
            const {
                sender
            } = params;
            if (livePreview) {
                mode = LIVE_PREVIEW;
                payload = {
                    livePreviewId
                };
            } else {
                mode = PREVIEW;
                tunnelPreview(params);
            }
            sender(SETUP, {
                mode,
                hublet,
                clientLoadOnly,
                windowWidth: getInnerWidth(),
                payload: Object.assign({}, uiSetup, payload)
            });
        });
    } else if (isHubspot) {
        uiSetup.hsEmail = hsEmail;
        getReadyFrame(FETCHER, ({
            sender
        }) => {
            sender(SETUP, {
                email: hsEmail,
                portalId: customerPortalId,
                pageUrl: getLocation().href,
                targetPortalId: portalId,
                isHubspot,
                hublet,
                clientLoadOnly
            });
            client.setFetcher(sender);
        });
    } else {
        hsq.push(['addCookieListener', hstc => {
            if (!hstc) return;
            const utk = hstc.split('.')[1];
            uiSetup.utk = utk;
            getReadyFrame(FETCHER, payload => {
                const {
                    sender
                } = payload;
                sender(SETUP, {
                    pageUrl: getLocation().href,
                    portalId,
                    utk,
                    hublet,
                    clientLoadOnly
                });
                client.setFetcher(sender);
            });
        }]);
    }
}
window.hsFeedbackLoaded = true;