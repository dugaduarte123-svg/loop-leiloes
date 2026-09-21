import { START_TRACK_SCROLL_PERCENTAGE } from '../../constants/PostMessageTypes';
import { postMessageToParent } from '../../post-message/postMessageToParent';
export const postStartTrackScrollPercentage = () => {
  postMessageToParent(START_TRACK_SCROLL_PERCENTAGE);
};