import { STORE_MESSAGES_COOKIE } from '../constants/PostMessageTypes';
import { postMessageToParent } from './postMessageToParent';
export const handleStoreMessagesCookie = data => postMessageToParent(STORE_MESSAGES_COOKIE, data);