import { reportError } from 'conversations-error-reporting/error-reporting/reportError';
import { DEFAULT_CLIENT_KEY } from '../constants/clientKeys';
import { initializePubSubStarted, initializePubSubSucceeded, initializePubSubFailed, pubSubReady, pubSubReconnected, pubSubDisconnected, pubSubReconnecting, pubSubSuspended } from './asyncPubSubClientActions';
import { DEFAULT_LIFECYCLE_HOOKS } from '../constants/pubsubLifecycleHooks';
/**
 * @typedef lifeCycleHooks
 * @type {Object}
 * @property {function} onConnect - Called when the client has connected
 * @property {function} onConnecting - Called when the client is connecting
 * @property {function} onDisconnect - Called when the client has disconnected
 * @property {function} onSuspended - Called when the client becomes suspended
 * @property {function} onFailure - Called when the client fails (not recoverable)
 */
/**
 * Initialize a connection
 *
 * @param {Object} connectionConfig - connection configuration
 * @param {Object} connectionConfig.clientOptions - Ably client options found here https://www.ably.io/documentation/realtime/usage#client-options
 * @param {lifeCycleHooks} connectionConfig.lifeCycleHooks - Connection life cycle callbacks
 * @param {function} connectionConfig.resolveBuilder - A resolver function to load the pub sub code split
 */
export const initializePubSub = ({
  clientOptions,
  lifecycleHooks = DEFAULT_LIFECYCLE_HOOKS,
  resolveBuilder,
  clientKey = DEFAULT_CLIENT_KEY
}) => dispatch => {
  dispatch(initializePubSubStarted(clientKey));
  lifecycleHooks = Object.assign({}, DEFAULT_LIFECYCLE_HOOKS, lifecycleHooks);
  return resolveBuilder().then(({
    buildConversationsPubSub
  }) => {
    const client = buildConversationsPubSub({
      clientOptions,
      lifecycleHooks: Object.assign({}, lifecycleHooks, {
        onConnect(params) {
          var _lifecycleHooks$onCon, _lifecycleHooks;
          if (params.reconnected) {
            dispatch(pubSubReconnected(clientKey));
          } else {
            dispatch(pubSubReady(clientKey));
          }
          (_lifecycleHooks$onCon = (_lifecycleHooks = lifecycleHooks).onConnect) === null || _lifecycleHooks$onCon === void 0 || _lifecycleHooks$onCon.call(_lifecycleHooks, params);
        },
        onConnecting({
          reconnecting
        }) {
          var _lifecycleHooks$onCon2, _lifecycleHooks2;
          if (reconnecting) {
            dispatch(pubSubReconnecting(clientKey));
          }
          (_lifecycleHooks$onCon2 = (_lifecycleHooks2 = lifecycleHooks).onConnecting) === null || _lifecycleHooks$onCon2 === void 0 || _lifecycleHooks$onCon2.call(_lifecycleHooks2, {
            reconnecting
          });
        },
        onDisconnect() {
          var _lifecycleHooks$onDis, _lifecycleHooks3;
          dispatch(pubSubDisconnected(clientKey));
          (_lifecycleHooks$onDis = (_lifecycleHooks3 = lifecycleHooks).onDisconnect) === null || _lifecycleHooks$onDis === void 0 || _lifecycleHooks$onDis.call(_lifecycleHooks3);
        },
        onSuspended() {
          var _lifecycleHooks$onSus, _lifecycleHooks4;
          dispatch(pubSubSuspended(clientKey));
          (_lifecycleHooks$onSus = (_lifecycleHooks4 = lifecycleHooks).onSuspended) === null || _lifecycleHooks$onSus === void 0 || _lifecycleHooks$onSus.call(_lifecycleHooks4);
        }
      })
    });
    dispatch(initializePubSubSucceeded(client, clientKey));
    client.connect().catch(() => {});
  }, error => {
    dispatch(initializePubSubFailed(error, clientKey));
    reportError({
      error: error
    });
  });
};