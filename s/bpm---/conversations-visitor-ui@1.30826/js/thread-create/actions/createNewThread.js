'use es6';

import ThreadHistory from 'conversations-message-history/thread-history/records/ThreadHistory';
import {
    createAction
} from '@reduxjs/toolkit';
import {
    Map as ImmutableMap
} from 'immutable';
import get from 'transmute/get';
import Raven from 'raven-js';
import {
    addAvailabilityMessage
} from '../../availability/actions/addAvailabilityMessage';
import {
    handleStoreMessagesCookie
} from '../../post-message/handleStoreMessagesCookie';
import {
    getMessageId
} from '../../selectors/pubNubMessageSelectors/getMessageId';
import {
    getMessagesPageUri
} from '../../selectors/widgetDataSelectors/getMessagesPageUri';
import {
    getSessionId
} from '../../selectors/widgetDataSelectors/getSessionId';
import {
    buildCreatedThread
} from '../operators/buildCreatedThread';
import {
    getVisitorInitialThreadHistory
} from '../selectors/stagedThreadSelectors';
import {
    trackInteraction
} from '../../usage-tracking/actions/trackInteraction';
import {
    EVENT_NAMES
} from '../../usage-tracking/constants/eventNames';
import {
    getHubspotUtk
} from '../../query-params/hubspotUtk';
import {
    updateSessionId
} from '../../widget-data/actions/updateSessionId';
import {
    createVisitorThread
} from '../clients/createVisitorThread';
import {
    CREATE_NEW_THREAD
} from '../constants/actionTypes';
import {
    postConversationStartedEvent
} from './postConversationStartedEvent';
import {
    getChannelName
} from '../../channel-details/operators/channelDetailsGetters';
import {
    getLatestWidgetData
} from '../../widget-data/selectors/getLatestWidgetData';
import {
    gdprCookieConsentOnExitIntentEnabled
} from '../../utils/gdprCookieConsentPromptHelpers';
import {
    getIsPrivateLoad
} from '../../widget-data/operators/getIsPrivateLoad';
import {
    getMessagesUtk
} from '../../query-params/getMessagesUtk';
import {
    getUserTimezone
} from '../operators/getUserTimezone';
import {
    postMessageToParent
} from '../../post-message/postMessageToParent';
import {
    trackThreadCreatedMetric
} from '../../usage-tracking/utils/trackMetric';
import TypingIndicatorMessage from 'conversations-message-history/typing-indicator/records/TypingIndicatorMessage';
import {
    typingMessageReceived
} from '../../typing-indicators/actions/typingMessageReceived';
import {
    getEntryUrlMetadata
} from '../selectors/entryUrlMetadataSelectors';
const createNewThreadStarted = createAction(CREATE_NEW_THREAD.STARTED);
const createNewThreadSucceeded = createAction(CREATE_NEW_THREAD.SUCCEEDED, ({
    channel,
    threadId,
    conversation,
    threadHistory,
    shouldAskForEmail
}) => ({
    payload: {
        channel,
        threadId,
        conversation,
        threadHistory,
        shouldAskForEmail
    }
}));
const createNewThreadFailed = createAction(CREATE_NEW_THREAD.FAILED, ({
    status,
    message,
    error
}) => ({
    payload: {
        status,
        message,
        error
    }
}));
let lastInitialMessageId;
export function createNewThread() {
    return (dispatch, getState) => {
        const sessionId = getSessionId(getState());
        const messageId = getMessageId(getState());
        const messagesPageUri = getMessagesPageUri(getState());
        const hubspotUtk = getHubspotUtk();
        const widgetData = getLatestWidgetData(getState());
        const visitorThreadInitialHistory = getVisitorInitialThreadHistory(getState());
        const entryUrlMetadata = getEntryUrlMetadata(getState());
        const initialMessageId = (visitorThreadInitialHistory[0] || [{}]).id;
        if (initialMessageId === undefined || lastInitialMessageId === initialMessageId) {
            if (lastInitialMessageId === initialMessageId) {
                Raven.captureMessage('createNewThread attempted duplicate initial message', {
                    level: 'warning',
                    extra: {
                        initialMessageId
                    }
                });
            }
            // no-op - this is to prevent the initial message being sent multiple times in edge cases
            return null;
        } else {
            lastInitialMessageId = initialMessageId;
        }
        dispatch(createNewThreadStarted());
        return createVisitorThread({
            sessionId,
            hubspotUtk,
            messageId,
            messagesPageUri,
            visitorThreadInitialHistory,
            widgetData,
            zoneId: getUserTimezone(),
            entryUrlMetadata
        }).then(({
            channelDetails,
            sessionId: newSessionId,
            id: threadId,
            history,
            shouldAskForEmail
        }) => {
            const threadHistory = new ThreadHistory(Object.assign({}, history, {
                attachments: ImmutableMap(get('attachments', history))
            }));
            const conversation = buildCreatedThread({
                channelDetails,
                messagesPageUri,
                threadId,
                threadHistory
            });
            dispatch(updateSessionId(newSessionId));
            dispatch(trackInteraction(EVENT_NAMES.START_CONVERSATION, {
                action: 'new conversation started',
                threadId
            }));
            trackThreadCreatedMetric();
            dispatch(createNewThreadSucceeded({
                channel: getChannelName(channelDetails),
                threadId,
                conversation,
                threadHistory,
                shouldAskForEmail
            }));
            dispatch(addAvailabilityMessage({
                channel: getChannelName(channelDetails),
                threadId
            }));
            postConversationStartedEvent({
                thread: conversation
            });

            // If Widget Data indicates that the responder is likely to be AI...
            // ...then send an initial typing message indicator
            const aiSender = widgetData.sendFrom.find(res => res.isResponderAI);
            if (aiSender) {
                const aiSenderId = get('userId', aiSender);
                const message = new TypingIndicatorMessage({
                    sender: {
                        '@type': 'AGENT_SENDER',
                        id: aiSenderId
                    }
                });
                dispatch(typingMessageReceived(message, threadId, 10000));
            }
            const cookieConsentOnExitEnabled = gdprCookieConsentOnExitIntentEnabled(getState(), widgetData);
            if (!cookieConsentOnExitEnabled && !getIsPrivateLoad(widgetData)) {
                handleStoreMessagesCookie(getMessagesUtk());
            }
        }).catch((err = {}) => {
            var _err$responseJSON;
            lastInitialMessageId = undefined;
            if (err.status === 400 && ((_err$responseJSON = err.responseJSON) === null || _err$responseJSON === void 0 ? void 0 : _err$responseJSON.errorType) === `OUTDATED_MESSAGE`) {
                postMessageToParent('refresh-widget-data');
            }
            dispatch(createNewThreadFailed({
                status: err.status,
                message: err.message,
                error: err
            }));
        });
    };
}