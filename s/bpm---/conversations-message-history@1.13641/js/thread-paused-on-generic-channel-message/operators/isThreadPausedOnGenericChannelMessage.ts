import get from 'transmute/get';
import { THREAD_PAUSED_ON_GENERIC_CHANNEL } from '../constants/messageTypes';
export const isThreadPausedOnGenericChannelMessage = message => {
  return get('@type', message) === THREAD_PAUSED_ON_GENERIC_CHANNEL;
};