'use es6';

import {
    Map as ImmutableMap
} from 'immutable';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import {
    getAsyncPubSubClient
} from 'conversations-internal-pub-sub/redux/selectors/pubSubClientGetters';
import {
    getChannelName,
    getThreadId
} from '../../threads/operators/threadGetters';
import {
    isUninitialized
} from '../../constants/asyncStatuses';
import {
    CREATE_NEW_THREAD
} from '../../thread-create/constants/actionTypes';
import {
    hasPersistedThreads
} from '../../threads/selectors/hasPersistedThreads';
import {
    startPubSub
} from '../actions/startPubSub';
import {
    isClientReady
} from 'conversations-internal-pub-sub/redux/operators/isClientReady';
import {
    onMessageReceived
} from '../actions/onMessageReceived';
import Raven from 'raven-js';
import {
    PUBSUB_READY,
    RESUBSCRIBE
} from 'conversations-internal-pub-sub/redux/constants/actionTypes';
import {
    updateSubscriptions
} from 'conversations-internal-pub-sub/redux/actions/subscriptions';
import {
    getThreads
} from '../../threads/selectors/getThreads';
import {
    CHANNEL_CHANGE_RECEIVED
} from '../constants/pubsubActionTypes';
import {
    filterRejectedMessagesFromPlayback
} from '../util/filterRejectedMessages';
const SUBSCRIBE_TRIGGERS = [PUBSUB_READY, RESUBSCRIBE, CREATE_NEW_THREAD.SUCCEEDED, ActionTypes.GET_VISITOR_THREADS_SUCCESS, CHANNEL_CHANGE_RECEIVED];
export const realtime = store => {
    const applyMessageHandler = threads => threads.reduce((acc, thread) => {
        const channel = getChannelName(thread);
        const threadId = getThreadId(thread);
        return acc.set(channel, {
            onMessage: message => store.dispatch(onMessageReceived({
                channel,
                message,
                threadId,
                publishContext: {
                    playback: false
                }
            })),
            // TODO: Communication team recommends creating
            // a batch action for handling all playback messages
            // at once to avoid intermediary state thrashing
            onPlayback: messages => {
                const filteredMessages = filterRejectedMessagesFromPlayback(messages);
                filteredMessages.forEach(message => {
                    try {
                        store.dispatch(onMessageReceived({
                            channel,
                            message,
                            threadId,
                            publishContext: {
                                playback: true
                            }
                        }));
                    } catch (error) {
                        Raven.captureException(error, {
                            extra: {
                                threadId,
                                channel
                            }
                        });
                    }
                });
            },
            // ensure visitor is entered into presence
            // on the agent->visitor channel. Subscribe
            // to these messages to get presence state updates
            onPresence: __presenceState => {}
        });
    }, ImmutableMap()).toJS();
    return next => action => {
        const result = next(action);
        const asyncPubSubClient = getAsyncPubSubClient(store.getState());
        const newThreadCreated = action.type === CREATE_NEW_THREAD.SUCCEEDED;
        const visitorHasExistingThreads = action.type === ActionTypes.GET_VISITOR_THREADS_SUCCESS && hasPersistedThreads(store.getState());
        if (isUninitialized(asyncPubSubClient) && (newThreadCreated || visitorHasExistingThreads)) {
            store.dispatch(startPubSub({
                newThreadCreated
            }));
        }
        if (isClientReady(asyncPubSubClient) && SUBSCRIBE_TRIGGERS.includes(action.type)) {
            const threads = getThreads(store.getState());
            const subscriptions = applyMessageHandler(threads);
            store.dispatch(updateSubscriptions(subscriptions));
        }
        return result;
    };
};