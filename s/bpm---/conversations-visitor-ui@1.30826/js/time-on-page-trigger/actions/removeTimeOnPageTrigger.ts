import { getTimeOnPageTriggerTimeoutId } from '../selectors/getTimeOnPageTriggerTimeoutId';
import { removeTimeOnPageTriggerAction } from './removeTimeOnPageTriggerAction';
export const removeTimeOnPageTrigger = () => (dispatch, getState) => {
  const timeoutId = getTimeOnPageTriggerTimeoutId(getState());
  clearTimeout(timeoutId);
  dispatch(removeTimeOnPageTriggerAction());
};