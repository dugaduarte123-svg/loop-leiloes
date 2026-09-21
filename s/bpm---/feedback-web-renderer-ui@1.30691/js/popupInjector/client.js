'use es6';

import * as DOM from '../utils/dom';
import * as MessageTypes from 'feedback-schema/constants/messageTypes';
import {
    FETCHER
} from 'feedback-schema/constants/messageChannels';
import * as Style from './style';
import {
    parentSender
} from 'feedback-utils/messages';
const send = parentSender(FETCHER);
const MIN_DELAY_MS = 1000;
const calculateFeedbackSurveyPosition = () => {
    const zorseWidget = document.querySelector('#isc-zorse-widget') || document.querySelector('#chat-widget');
    const feedbackSurvey = document.getElementById('hs-feedback-ui');
    if (zorseWidget) {
        const zorseWidgetContent = zorseWidget.children[0];
        if (zorseWidgetContent) {
            const zorseContentWidth = zorseWidgetContent.clientWidth;
            const feedbackSurveyMarginRight = zorseContentWidth + 20;
            if (feedbackSurvey) {
                feedbackSurvey.style.marginRight = `${feedbackSurveyMarginRight}px`;
            }
        }
    } else {
        if (feedbackSurvey) {
            feedbackSurvey.style.marginRight = '0px';
        }
    }
};
class FeedbackWebClient {
    constructor() {
        this.setFetcher = fetcher => {
            this.fetcher = fetcher;
            this._runQueuedEvents();
            return this;
        };
        this.initialiseUI = ({
            iframe,
            parent,
            sender
        }) => {
            this.iframe = iframe;
            this.sendToIframe = sender;
            this.iframeWrapper = parent;
            this._runQueuedEvents();
            setInterval(calculateFeedbackSurveyPosition, 100);
        };
        this._runQueuedEvents = () => {
            const queuedEvents = this.queuedEvents;
            this.queuedEvents = [];
            queuedEvents.forEach(event => event(this));
        };
        this._onSurveyLoaded = surveyConfig => {
            this._setMetaData(surveyConfig);
            if (this.onSurveyLoad) {
                this.onSurveyLoad(surveyConfig);
            }
        };
        this._queueEvent = event => {
            this.queuedEvents.push(event);
            return this;
        };
        this._push = event => {
            this._queueEvent(event);
            if (this.fetcher) {
                this._runQueuedEvents();
            }
        };
        this._setSurveyLanguage = config => {
            this.surveyLanguage = config.config.language;
        };
        this._setMetaData = config => {
            this._setSurveyLanguage(config);
            this.config = config;
            return this;
        };
        this._onConfigLoaded = config => {
            this._setMetaData(config);
            if (this.onConfigLoaded) {
                this.onConfigLoaded(config);
            }
            return this;
        };
        this.hide = () => {
            if (!this.iframeWrapper) {
                return this._queueEvent(this.hide);
            }
            DOM.addClass(this.iframeWrapper, Style.SLID_OUT_CLASS);
            window.setTimeout(() => {
                DOM.removeClass(this.iframeWrapper, Style.SHOWN_CLASS);
            }, 500);
            return this;
        };
        this.show = () => {
            if (!this.iframeWrapper) {
                return this._queueEvent(this.show);
            }
            DOM.removeClass(this.iframeWrapper, Style.SLID_OUT_CLASS);
            DOM.addClass(this.iframeWrapper, Style.SHOWN_CLASS);
            return this;
        };
        this.expand = () => {
            if (!this.iframeWrapper) {
                return this._queueEvent(this.expand);
            }
            DOM.addClass(this.iframeWrapper, Style.EXPANDED_CLASS);
            this.sendToIframe(MessageTypes.CHANGE_EXPANDED_STATE, true);
            return this;
        };
        this.minimize = () => {
            if (!this.iframeWrapper) {
                return this._queueEvent(this.minimize);
            }
            DOM.removeClass(this.iframeWrapper, Style.EXPANDED_CLASS);
            this.sendToIframe(MessageTypes.CHANGE_EXPANDED_STATE, false);
            return this;
        };
        this.reset = () => {
            if (!this.iframeWrapper) {
                return this._queueEvent(this.reset);
            }
            this.sendToIframe(MessageTypes.RESET, false);
            return this;
        };
        this.showOnMouseLeave = (expand = false) => {
            const onMouseLeave = () => {
                if (expand) {
                    this.expand();
                }
                this.show();
                document.removeEventListener('mouseleave', onMouseLeave);
            };
            document.addEventListener('mouseleave', onMouseLeave);
            return this;
        };
        this.showOnScroll = (expand = false) => {
            const pageHeight = Math.max(document.body.offsetHeight, document.body.scrollHeight);
            const showPoint = (pageHeight - window.innerHeight) * 0.5;
            const onShow = () => {
                if (expand) {
                    this.expand();
                }
                this.show();
            };
            if (pageHeight === window.innerHeight) {
                setTimeout(onShow, MIN_DELAY_MS);
                return this;
            }
            const onScroll = () => {
                const scrollHeight = document.body.scrollTop || window.pageYOffset;
                if (window.innerHeight + scrollHeight > showPoint) {
                    onShow();
                    document.removeEventListener('scroll', onScroll);
                }
            };
            document.addEventListener('scroll', onScroll);
            return this;
        };
        this.loadConfigOnly = (surveyType, surveyId) => {
            if (!this.fetcher) {
                return this._queueEvent(() => this.loadConfigOnly(surveyType, surveyId));
            }
            this.fetcher(MessageTypes.LOAD_CONFIG_ONLY, {
                surveyType,
                surveyId
            });
            return this;
        };
        this.loadSurvey = (surveyType, surveyId) => {
            if (!this.fetcher) {
                return this._queueEvent(() => this.loadSurvey(surveyType, surveyId));
            }
            this.fetcher(MessageTypes.LOAD_SURVEY, {
                surveyType,
                surveyId
            });
            return this;
        };
        this.showSurvey = config => {
            if (!this.fetcher) {
                return this._queueEvent(() => this.showSurvey());
            }
            if (!config) {
                return this;
            }
            this.fetcher(MessageTypes.SHOW_LOADED_CONFIG, config);
            return this;
        };
        this.checkIsLanguageValid = userLanguage => {
            return userLanguage === this.surveyLanguage;
        };
        this.renderSurvey = () => {
            if (!this.config) {
                return this._queueEvent(() => this.renderSurvey());
            }
            send(MessageTypes.SURVEY_FETCHED, this.config);
            return this;
        };
        this.getSurveyConfig = () => {
            return this.config;
        };
        this.fetcher = null;
        this.onSurveyLoad = null;
        this._onReady = null;
        this.iframeWrapper = null;
        this.iframe = null;
        this.sendToIframe = null;
        this.onConfigLoaded = null;
        this.surveyLanguage = null;
        this.config = null;
        this.queuedEvents = window.onHsFeedbackReady || [];
        window.hsFeedback = this;
        window.onHsFeedbackReady = {
            push: this._push
        };
    }
}
export default FeedbackWebClient;