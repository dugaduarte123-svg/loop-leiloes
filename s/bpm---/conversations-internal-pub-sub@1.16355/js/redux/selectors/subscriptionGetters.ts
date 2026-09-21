import get from 'transmute/get';
import { createSelector } from 'reselect';
import { getData } from 'conversations-async-data/async-data/operators/getters';
import { getEntry } from 'conversations-async-data/indexed-async-data/operators/getters';
import { DEFAULT_CLIENT_KEY } from '../constants/clientKeys';
export const getIndexedAsyncSubscriptions = get('subscriptions');
export const getClientKeyFromProps = (__state, {
  clientKey = DEFAULT_CLIENT_KEY
} = {}) => clientKey;
export const getAsyncSubscriptions = createSelector([getClientKeyFromProps, getIndexedAsyncSubscriptions], (clientKey, indexedData) => getEntry(clientKey, indexedData));
export const getSubscriptions = createSelector([getAsyncSubscriptions], getData);