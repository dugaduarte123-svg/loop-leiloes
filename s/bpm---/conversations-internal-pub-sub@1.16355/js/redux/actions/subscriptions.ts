/* hs-eslint ignored failing-rules */

import { UPDATE_SUBSCRIPTIONS, RESUBSCRIBE } from '../constants/actionTypes';
import { DEFAULT_CLIENT_KEY } from '../constants/clientKeys';
import { getPubSubClient } from '../selectors/pubSubClientGetters';
import { silenceErrorAlert } from 'conversations-error-reporting/error-actions/builders/silenceErrorAlert';
import { getSubscriptions } from '../selectors/subscriptionGetters';
import { DEBOUNCED } from '../../utils/debounceApi';
const updateSubscriptionsStarted = (subscriptions, clientKey = DEFAULT_CLIENT_KEY) => ({
  type: UPDATE_SUBSCRIPTIONS.STARTED,
  payload: {
    clientKey,
    subscriptions
  }
});
const updateSubscriptionsSucceeded = (subscriptions, clientKey = DEFAULT_CLIENT_KEY) => ({
  type: UPDATE_SUBSCRIPTIONS.SUCCEEDED,
  payload: {
    clientKey,
    subscriptions
  }
});
const updateSubscriptionsFailed = (error, clientKey = DEFAULT_CLIENT_KEY) => ({
  type: UPDATE_SUBSCRIPTIONS.FAILED,
  payload: {
    clientKey,
    error
  },
  meta: silenceErrorAlert()
});
export const resubscribe = clientKey => ({
  type: RESUBSCRIBE,
  payload: {
    clientKey
  }
});

/**
 * @typedef subscriptionObject
 * @type {Object}
 * @property {function} onMessage - Called when a message is received
 * @property {function} [onPlayback] - Optional callback to received messages that are played back

/**
 * Update the current subscriptions.
 *
 * @param {Object<string, subscriptionObject>} subscriptions - A mapping of channel and subscription
 */
export const updateSubscriptions = (subscriptions, clientKey = DEFAULT_CLIENT_KEY) => (dispatch, getState) => {
  const client = getPubSubClient(getState(), {
    clientKey
  });
  if (!client) {
    dispatch(updateSubscriptionsFailed(new Error('PubSub client not initialized'), clientKey));
    return;
  }
  dispatch(updateSubscriptionsStarted(subscriptions, clientKey));
  client.updateSubscriptions(subscriptions).then(result => {
    if (result === DEBOUNCED) {
      // An out of date subscription update was skipped in favor of a more recent update.
      return;
    }
    dispatch(updateSubscriptionsSucceeded(result, clientKey));
  }, error => {
    dispatch(updateSubscriptionsFailed(error, clientKey));
  }).catch(error => {
    setTimeout(() => {
      dispatch(updateSubscriptionsFailed(error, clientKey));
    });
  });
};
export const overwriteSubscriptions = (subscriptions, clientKey = DEFAULT_CLIENT_KEY) => (dispatch, getState) => {
  const client = getPubSubClient(getState(), {
    clientKey
  });
  if (!client) {
    dispatch(updateSubscriptionsFailed(new Error('PubSub client not initialized'), clientKey));
    return;
  }
  dispatch(updateSubscriptionsStarted(subscriptions, clientKey));
  client.overwriteSubscriptions(subscriptions).then(result => {
    if (result === DEBOUNCED) {
      // An out of date subscription update was skipped in favor of a more recent update.
      return;
    }
    dispatch(updateSubscriptionsSucceeded(result, clientKey));
  }, error => {
    dispatch(updateSubscriptionsFailed(error, clientKey));
  }).catch(error => {
    setTimeout(() => {
      dispatch(updateSubscriptionsFailed(error, clientKey));
    });
  });
};
export const updateSubscriptionsWithKey = newSubscriptions => (dispatch, getState) => {
  const clientKey = DEFAULT_CLIENT_KEY;
  const client = getPubSubClient(getState(), {
    clientKey
  });
  const existingSubscriptions = getSubscriptions(getState(), {
    clientKey
  }) || {};
  // For each subscription in the new subscriptions, if it already exists in the existing subscriptions, update it, otherwise add it
  const updatedSubscriptions = Object.keys(newSubscriptions).reduce((newSubscriptionsForChannel, channelName) => {
    // Represents new listeners for a single channel (the channel may be new or existing)
    const newListenersForChannel = newSubscriptions[channelName];
    const keyForChannel = newListenersForChannel.key;

    // Search the current subscriptions to find one with a matching key
    const [existingChannelName, existingSubscription] = Object.entries(existingSubscriptions).find(([__, subscription]) => subscription.key === keyForChannel) || [];

    // If an existing subscription for this key was found, overwrite the existing subscription with the new channel name and listeners
    if (existingChannelName && existingSubscription) {
      delete existingSubscriptions[existingChannelName];
    }
    newSubscriptionsForChannel[channelName] = newListenersForChannel;
    return newSubscriptionsForChannel;
  }, existingSubscriptions);
  if (!client) {
    dispatch(updateSubscriptionsFailed(new Error('PubSub client not initialized'), clientKey));
    return;
  }
  dispatch(updateSubscriptionsStarted(updatedSubscriptions, clientKey));
  client.updateSubscriptions(updatedSubscriptions).then(result => {
    if (result === DEBOUNCED) {
      // An out of date subscription update was skipped in favor of a more recent update.
      return;
    }
    dispatch(updateSubscriptionsSucceeded(result, clientKey));
  }, error => {
    dispatch(updateSubscriptionsFailed(error, clientKey));
  }).catch(error => {
    setTimeout(() => {
      dispatch(updateSubscriptionsFailed(error, clientKey));
    });
  });
};