import IndexedAsyncData from 'conversations-async-data/indexed-async-data/IndexedAsyncData';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { updateEntry } from 'conversations-async-data/indexed-async-data/operators/updateEntry';
import { requestFailed } from 'conversations-async-data/async-data/operators/requestFailed';
import { requestStarted } from 'conversations-async-data/async-data/operators/requestStarted';
import { requestStateUpdate } from 'conversations-async-data/async-data/operators/requestStateUpdate';
import { requestSucceededWithOperator } from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import { stringIdInvariant } from 'conversations-async-data/indexed-async-data/invariants/stringIdInvariant';
import { INITIALIZE_PUBSUB, PUBSUB_READY, PUBSUB_RECONNECTED, PUBSUB_DISCONNECTED, PUBSUB_RECONNECTING, PUBSUB_SUSPENDED } from '../constants/actionTypes';
import { CONNECTED, DISCONNECTED, RECONNECTING, SUSPENDED } from '../constants/states';
const idenity = f => f;
const initialState = new IndexedAsyncData({
  name: 'pubSubClient',
  idInvariant: stringIdInvariant,
  notSetValue: new AsyncData()
});
export const pubSubClient = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE_PUBSUB.STARTED:
      {
        const {
          clientKey
        } = action.payload;
        return updateEntry(clientKey, requestStarted, state);
      }
    case INITIALIZE_PUBSUB.SUCCEEDED:
      {
        const {
          client,
          clientKey
        } = action.payload;
        return updateEntry(clientKey, requestSucceededWithOperator(() => client !== null && client !== void 0 ? client : null), state);
      }
    case INITIALIZE_PUBSUB.FAILED:
      {
        const {
          clientKey
        } = action.payload;
        return updateEntry(clientKey, requestFailed, state);
      }
    case PUBSUB_RECONNECTING:
      {
        const {
          clientKey
        } = action.payload;
        return updateEntry(clientKey,
        // This and the following casts are needed since the library's type definition is too narrow for these custom statuses
        // (they work at runtime but aren't in the AsyncStatusType union, and we are trying to avoid updates to Async-data)
        requestStateUpdate(RECONNECTING, idenity), state);
      }
    case PUBSUB_RECONNECTED:
    case PUBSUB_READY:
      {
        const {
          clientKey
        } = action.payload;
        return updateEntry(clientKey, requestStateUpdate(CONNECTED, idenity), state);
      }
    case PUBSUB_DISCONNECTED:
      {
        const {
          clientKey
        } = action.payload;
        return updateEntry(clientKey, requestStateUpdate(DISCONNECTED, idenity), state);
      }
    case PUBSUB_SUSPENDED:
      {
        const {
          clientKey
        } = action.payload;
        return updateEntry(clientKey, requestStateUpdate(SUSPENDED, idenity), state);
      }
    default:
      {
        return state;
      }
  }
};