import { PARTIAL_MESSAGE } from '../constants/messageTypes';
import get from 'transmute/get';
export const isPartialMessage = message => {
  return get('@type', message) === PARTIAL_MESSAGE;
};