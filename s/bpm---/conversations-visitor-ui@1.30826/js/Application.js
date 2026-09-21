'use es6';

import Raven from 'raven-js';
// eslint-disable-next-line react/no-deprecated
import {
    render
} from 'react-dom';
import {
    RhumbProvider
} from 'react-rhumb';
import staticAdapter from 'react-rhumb/staticAdapter';
import PortalIdParser from 'PortalIdParser';
import Url from 'urlinator/Url';
import {
    DataFetchingClientProvider
} from 'data-fetching-client';
import rhumbConfig from '../rhumb-config.yaml';
import ApplicationContainer from './containers/ApplicationContainer';
import AsyncMessagesPreview from './code-splitting/components/AsyncMessagesPreview';
import ErrorBoundary from './components/ErrorBoundary';
import {
    PREVIEW,
    STANDARD
} from './constants/WidgetModes';
import {
    initializeI18n
} from './utils/initializeI18n';
import {
    getMessagesUtk
} from './query-params/getMessagesUtk';
import {
    VisitorIdentityContextProvider
} from './visitorIdentityContext/VisitorIdentityContext';
import ReduxProvider from './ReduxProvider';
import {
    AccessibilityContextProvider
} from 'conversations-visitor-message-history/accessibility/AccessibilityContext';
import {
    parseStringBoolean
} from './utils/parseStringBoolean';
import {
    isFunction
} from './utils/isFunction';
import {
    dataFetchingClient
} from './data-fetching-client/dataFetchingClient';
import {
    jsx as _jsx
} from "react/jsx-runtime";
export default class Application {
    constructor() {
        this.widgetShellUrl = new Url(window.location);
    }
    getQueryParam(param) {
        return this.widgetShellUrl.paramValue(param);
    }
    setSentryTags() {
        // Certain bots are able to block Sentry,
        // causing this function to fail.
        if (isFunction(Raven.setTagsContext)) {
            Raven.setTagsContext({
                messagesUtk: getMessagesUtk(),
                hubspotUtk: this.getQueryParam('hubspotUtk'),
                locale: navigator.language || navigator.userLanguage,
                parentUrl: this.getQueryParam('url'),
                isAttachmentDisabled: parseStringBoolean(this.getQueryParam('isAttachmentDisabled')),
                isInitialInputFocusDisabled: parseStringBoolean(this.getQueryParam('isInitialInputFocusDisabled')),
                isFullscreen: parseStringBoolean(this.getQueryParam('isFullscreen')),
                mode: this.getQueryParam('mode'),
                mobile: parseStringBoolean(this.getQueryParam('mobile')),
                isEmbeddedInProduct: parseStringBoolean(this.getQueryParam('inApp53')),
                enableWidgetCookieBanner: this.getQueryParam('enableWidgetCookieBanner'),
                hideNewThreadLink: parseStringBoolean(this.getQueryParam('hideNewThreadLink') || 'false')
            });
        }
    }
    renderWidget() {
        initializeI18n().then(() => {
            const inline = parseStringBoolean(this.getQueryParam('inline'));
            render( /*#__PURE__*/ _jsx(DataFetchingClientProvider, {
                client: dataFetchingClient,
                children: /*#__PURE__*/ _jsx(RhumbProvider, {
                    config: rhumbConfig,
                    history: staticAdapter('/'),
                    children: /*#__PURE__*/ _jsx(ErrorBoundary, {
                        errorLoggingTitle: "visitor-widget",
                        children: /*#__PURE__*/ _jsx(VisitorIdentityContextProvider, {
                            children: /*#__PURE__*/ _jsx(ReduxProvider, {
                                children: /*#__PURE__*/ _jsx(AccessibilityContextProvider, {
                                    disableFocusTrap: inline,
                                    disableAutoFocus: inline,
                                    disableWidgetDialog: inline,
                                    children: /*#__PURE__*/ _jsx(ApplicationContainer, {
                                        location: window.location,
                                        inline: inline
                                    })
                                })
                            })
                        })
                    })
                })
            }), document.getElementsByClassName('widget')[0]);
        }).catch(err => {
            Raven.captureException(err);
        });
    }
    renderPreview() {
        render( /*#__PURE__*/ _jsx(DataFetchingClientProvider, {
            client: dataFetchingClient,
            children: /*#__PURE__*/ _jsx(ErrorBoundary, {
                errorLoggingTitle: "message-preview",
                children: /*#__PURE__*/ _jsx(VisitorIdentityContextProvider, {
                    children: /*#__PURE__*/ _jsx(ReduxProvider, {
                        children: /*#__PURE__*/ _jsx(AccessibilityContextProvider, {
                            disableFocusTrap: true,
                            disableAutoFocus: true,
                            disableWidgetDialog: true,
                            children: /*#__PURE__*/ _jsx(AsyncMessagesPreview, {
                                location: window.location,
                                messageId: this.getQueryParam('messageId'),
                                messagesUtk: getMessagesUtk()
                            })
                        })
                    })
                })
            })
        }), document.getElementsByClassName('widget')[0]);
    }
    start() {
        window.AppInstance = this;
        this.setSentryTags();
        PortalIdParser.get();
        switch (this.getQueryParam('mode')) {
            case PREVIEW:
                this.renderPreview();
                return;
            case STANDARD:
            default:
                this.renderWidget();
                return;
        }
    }
}
const app = new Application();
app.start();