import getIn from 'transmute/getIn';
import { ALLOW_RETRY, THREAD_ID, CHANNEL, MESSAGE } from '../constants/keyPaths';
export const getAllowRetry = getIn(ALLOW_RETRY);
export const getThreadId = getIn(THREAD_ID);
export const getChannel = getIn(CHANNEL);
export const getMessage = getIn(MESSAGE);