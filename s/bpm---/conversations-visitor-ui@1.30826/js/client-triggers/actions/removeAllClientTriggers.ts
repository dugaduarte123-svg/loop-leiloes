import { postStopTrackScrollPercentage } from '../../scroll-percentage-trigger/actions/postStopTrackScrollPercentage';
import { removeTimeOnPageTrigger } from '../../time-on-page-trigger/actions/removeTimeOnPageTrigger';
import { postStopTrackExitIntent } from '../../exit-intent-trigger/postStopTrackExitIntent';
export const removeAllClientTriggers = () => dispatch => {
  postStopTrackScrollPercentage();
  dispatch(removeTimeOnPageTrigger());
  postStopTrackExitIntent();
};