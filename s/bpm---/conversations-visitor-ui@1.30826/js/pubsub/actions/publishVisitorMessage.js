'use es6';

import {
    getChannelName,
    getThreadId
} from '../../threads/operators/threadGetters';
import {
    WEB
} from 'conversations-message-history/common-message-format/constants/clientTypes';
import EmailAddressPattern from 'PatternValidationJS/patterns/EmailAddress';
import {
    createNewThread
} from '../../thread-create/actions/createNewThread';
import {
    applyGdprConsent
} from './applyGdprConsent';
import {
    publishMessage
} from './publishMessage';
import {
    isPersistedThread
} from '../../threads/operators/isPersistedThread';
import {
    clearAttachments
} from '../../file-uploads/actions/clearAttachments';
import {
    getSelectedThread
} from '../../selected-thread/selectors/getSelectedThread';
import {
    trackSendMessage
} from './trackSendMessage';
import {
    buildVisitorCommonMessage
} from '../util/buildVisitorCommonMessage';
import {
    stageMessageOnStubbedThread
} from '../../stubbed-thread-history/actions/stageMessageOnStubbedThread';
import {
    getMessagesPageUri
} from '../../selectors/widgetDataSelectors/getMessagesPageUri';
import {
    shouldRecordUrlContextUpdate
} from '../../pubnub-message/selectors/shouldRecordUrlContextUpdate';
import {
    updateThreadCurrentUrl
} from '../../threads/actions/updateThreadCurrentUrl';
import {
    sendVisitorEmailAddress
} from '../../email-capture/actions/VisitorEmailAddressActions';
import {
    getMostRecentMessageIsEmailPrompt
} from '../../thread-history/selectors/getMostRecentMessageIsEmailPrompt';
import {
    getMessagesUtk
} from '../../query-params/getMessagesUtk';
import {
    updateVisitorContext
} from '../../clients/updateVisitorContext';
import {
    getSessionId
} from '../../selectors/widgetDataSelectors/getSessionId';
import {
    STUBBED_THREAD_ID
} from '../../threads/constants/stubbedThreadId';
import {
    getChannelInstanceId
} from '../../selectors/widgetDataSelectors/getChannelInstanceId';
import {
    getChannelInstanceIdFromCurrentThreadHistory
} from '../../thread-history/selectors/getChannelInstanceIdFromCurrentThreadHistory';
import get from 'transmute/get';
import {
    QUICK_REPLIES
} from 'conversations-message-history/common-message-format/constants/attachmentTypes';
import {
    postQuickReplyButtonClickEvent
} from './postQuickReplyButtonClickEvent';
import {
    postExternalApiEvent
} from '../../external-api-events/postExternalApiEvent';
import {
    PLAY_BUTTON_PAUSE
} from '../../external-api-events/constants/externalApiEventTypes';
const updateVisitorLocation = () => (dispatch, getState) => {
    const currentThread = getSelectedThread(getState());
    const messagesPageUri = getMessagesPageUri(getState());
    const threadId = getThreadId(currentThread);
    const shouldUpdateVisitorLocation = shouldRecordUrlContextUpdate(getState(), {
        threadId
    });
    if (shouldUpdateVisitorLocation && threadId !== STUBBED_THREAD_ID) {
        return updateVisitorContext({
            currentUrl: messagesPageUri,
            sessionId: getSessionId(getState()),
            threadId
        }).then(() => {
            dispatch(updateThreadCurrentUrl({
                threadId,
                currentUrl: messagesPageUri
            }));
        }).catch(() => {
            return Promise.resolve();
        });
    }
    return Promise.resolve();
};
const pauseAudioOnVisitorMessage = getState => {
    var _state$speechPoc;
    const state = getState();
    if (((_state$speechPoc = state.speechPoc) === null || _state$speechPoc === void 0 ? void 0 : _state$speechPoc.audioPlaybackStatus) === 'playing') {
        postExternalApiEvent({
            eventType: PLAY_BUTTON_PAUSE,
            payload: {}
        });
    }
};
const executePublish = ({
    text,
    richText,
    quickReply,
    fileAttachment
}) => {
    return (dispatch, getState) => {
        pauseAudioOnVisitorMessage(getState);
        const currentThread = getSelectedThread(getState());
        const isPersisted = isPersistedThread(currentThread);
        const channel = getChannelName(currentThread);
        const threadId = getThreadId(currentThread);
        const senderId = getMessagesUtk();
        const channelInstanceId = isPersisted ? getChannelInstanceIdFromCurrentThreadHistory(getState(), threadId) : getChannelInstanceId(getState());
        const message = buildVisitorCommonMessage({
            channelInstanceId,
            clientType: WEB,
            fileAttachment,
            quickReply,
            richText,
            senderId,
            text
        });
        dispatch(clearAttachments(threadId));
        dispatch(trackSendMessage({
            threadId
        }));
        if (!isPersisted) {
            dispatch(stageMessageOnStubbedThread(message));
            return dispatch(createNewThread());
        }
        if (getMostRecentMessageIsEmailPrompt(getState()) && EmailAddressPattern.test(text)) {
            dispatch(sendVisitorEmailAddress({
                email: text,
                consentToCommunicate: false,
                threadId
            }));
        }
        return dispatch(publishMessage({
            channel,
            message,
            threadId
        })).then(() => dispatch(applyGdprConsent()));
    };
};
export function publishVisitorMessage({
    text,
    richText,
    quickReply,
    fileAttachment
}) {
    return dispatch => dispatch(updateVisitorLocation()).then(() => {
        dispatch(executePublish({
            text,
            richText,
            quickReply,
            fileAttachment
        }));
        if (quickReply && get('@type', quickReply) === QUICK_REPLIES) {
            postQuickReplyButtonClickEvent(quickReply);
        }
    });
}