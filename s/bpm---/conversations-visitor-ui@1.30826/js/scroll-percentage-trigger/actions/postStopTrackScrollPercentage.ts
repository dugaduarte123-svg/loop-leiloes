import { STOP_TRACK_SCROLL_PERCENTAGE } from '../../constants/PostMessageTypes';
import { postMessageToParent } from '../../post-message/postMessageToParent';
export const postStopTrackScrollPercentage = () => {
  postMessageToParent(STOP_TRACK_SCROLL_PERCENTAGE);
};