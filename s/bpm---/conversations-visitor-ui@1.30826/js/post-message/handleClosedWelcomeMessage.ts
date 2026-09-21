import { CLOSED_WELCOME_MESSAGE } from '../constants/PostMessageTypes';
import { postMessageToParent } from './postMessageToParent';
export const handleClosedWelcomeMessage = () => postMessageToParent(CLOSED_WELCOME_MESSAGE);