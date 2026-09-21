import { OPEN_CHANGE } from '../constants/PostMessageTypes';
import { postMessageToParent } from './postMessageToParent';
export const handleOpenChange = (isOpen, isUser) => postMessageToParent(OPEN_CHANGE, {
  isOpen,
  isUser
});