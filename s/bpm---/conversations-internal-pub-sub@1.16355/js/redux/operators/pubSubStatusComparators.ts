import { getStatus } from 'conversations-async-data/async-data/operators/getters';
import { CONNECTED, DISCONNECTED, RECONNECTING, RESUBSCRIBING, SUSPENDED } from '../constants/states';

/**
 * True when the client is connected
 *
 * @param {AsyncData} asyncPubSubClient - AsyncData containing the pub sub client
 * @returns {Boolean}
 */
export const isConnected = asyncPubSubClient =>
// This and the following casts are needed since the library's type definition is too narrow for these custom statuses
// (they work at runtime but aren't in the AsyncStatusType union, and we are trying to avoid updates to Async-data)
getStatus(asyncPubSubClient) === CONNECTED;

/**
 * True when the client is disconnected
 *
 * @param {AsyncData} asyncPubSubClient - AsyncData containing the pub sub client
 * @returns {Boolean}
 */
export const isDisconnected = asyncPubSubClient => getStatus(asyncPubSubClient) === DISCONNECTED;

/**
 * True when the client is isReconnecting
 *
 * @param {AsyncData} asyncPubSubClient - AsyncData containing the pub sub client
 * @returns {Boolean}
 */
export const isReconnecting = asyncPubSubClient => getStatus(asyncPubSubClient) === RECONNECTING;

/**
 * True when the subscriptions is isReconnecting
 *
 * @param {AsyncData} asyncSubscriptions - AsyncData containing the subscriptions
 * @returns {Boolean}
 */
export const isResubscribing = asyncSubscriptions => getStatus(asyncSubscriptions) === RESUBSCRIBING;

/**
 * True when the client is isReconnecting
 *
 * @param {AsyncData} asyncPubSubClient - AsyncData containing the pub sub client
 * @returns {Boolean}
 */
export const isSuspended = asyncPubSubClient => getStatus(asyncPubSubClient) === SUSPENDED;