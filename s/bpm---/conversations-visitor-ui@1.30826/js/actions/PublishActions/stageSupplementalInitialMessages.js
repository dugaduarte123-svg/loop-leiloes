'use es6';

import {
    getQuickReply
} from 'conversations-message-history/common-message-format/operators/cmfQuickReplyGetters';
import {
    getText,
    getRichText
} from 'conversations-message-history/initial-message/operators/initialMessageGetters';
import {
    buildSender
} from 'conversations-message-history/common-message-format/operators/buildSender';
import {
    toCmfSender
} from 'conversations-message-history/common-message-format/operators/cmfSenderInterop';
import {
    BOT_SENDER
} from 'conversations-message-history/common-message-format/constants/cmfSenderTypes';
import QuickReplyAttachment from 'conversations-message-history/common-message-format/records/QuickReplyAttachment';
import {
    NO_CONTENT
} from '../../constants/HttpStatusCodes';
import {
    getUserId
} from 'conversations-internal-schema/responders/operators/responderGetters';
import {
    createAction
} from '@reduxjs/toolkit';
import {
    getIsWidgetInAwayMode
} from '../../availability/selectors/getIsWidgetInAwayMode';
import {
    getAllowVisitorOfflineMessaging
} from '../../availability/selectors/getAllowVisitorOfflineMessaging';
import {
    fetchSupplementalInitialMessages
} from '../../clients/fetchSupplementalInitialMessages';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import {
    getAssignedResponderInWidget
} from '../../responders/selectors/getAssignedResponderInWidget';
import {
    getSessionId
} from '../../selectors/widgetDataSelectors/getSessionId';
import {
    stageMessageOnStubbedThread
} from '../../stubbed-thread-history/actions/stageMessageOnStubbedThread';
import {
    getHubspotUtk
} from '../../query-params/hubspotUtk';
import {
    getChannelInstanceId
} from '../../selectors/widgetDataSelectors/getChannelInstanceId';
import {
    buildBotInitialMessage
} from './buildBotInitialMessage';
const fetchSupplementalInitialMessagesStarted = createAction(ActionTypes.GET_SUPPLEMENTAL_INITIAL_MESSAGES);
export const fetchSupplementalInitialMessagesSucceeded = createAction(ActionTypes.GET_SUPPLEMENTAL_INITIAL_MESSAGES_SUCCEEDED);
const fetchSupplementalInitialMessagesFailed = createAction(ActionTypes.GET_SUPPLEMENTAL_INITIAL_MESSAGES_FAILED, error => ({
    payload: {
        error
    }
}));
export function stageSupplementalInitialMessages() {
    return (dispatch, getState) => {
        const state = getState();
        if (getIsWidgetInAwayMode(state) && !getAllowVisitorOfflineMessaging(state)) {
            return Promise.resolve();
        }
        const responder = getAssignedResponderInWidget(state);
        const botId = getUserId(responder);
        const sessionId = getSessionId(state);
        const hubspotUtk = getHubspotUtk();
        dispatch(fetchSupplementalInitialMessagesStarted());
        return fetchSupplementalInitialMessages({
            botId,
            sessionId,
            hubspotUtk
        }).then(response => {
            const messageContainers = response.status === NO_CONTENT || !Array.isArray(response.data) ? [] : response.data;
            dispatch(fetchSupplementalInitialMessagesSucceeded());
            messageContainers.forEach(({
                message
            }) => {
                const attachments = [];
                const quickReply = getQuickReply(message);
                if (quickReply) {
                    attachments.push(new QuickReplyAttachment(quickReply));
                }
                dispatch(stageMessageOnStubbedThread(buildBotInitialMessage({
                    id: message.id,
                    clientType: message.clientType,
                    sender: buildSender({
                        senderType: toCmfSender(message.senderType) || BOT_SENDER,
                        senderId: message.senderId
                    }),
                    status: Object.assign({}, message.status),
                    text: getText(message),
                    richText: getRichText(message),
                    attachments,
                    channelInstanceId: getChannelInstanceId(getState())
                })));
            });
        }).catch(err => {
            dispatch(fetchSupplementalInitialMessagesFailed(err));
        });
    };
}