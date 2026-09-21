import { STOP_TRACK_EXIT_INTENT } from '../constants/PostMessageTypes';
import { postMessageToParent } from '../post-message/postMessageToParent';
export const postStopTrackExitIntent = () => {
  postMessageToParent(STOP_TRACK_EXIT_INTENT);
};