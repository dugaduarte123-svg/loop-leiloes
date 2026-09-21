import { START_TRACK_EXIT_INTENT } from '../constants/PostMessageTypes';
import { postMessageToParent } from '../post-message/postMessageToParent';
export const postStartTrackExitIntent = () => {
  postMessageToParent(START_TRACK_EXIT_INTENT);
};