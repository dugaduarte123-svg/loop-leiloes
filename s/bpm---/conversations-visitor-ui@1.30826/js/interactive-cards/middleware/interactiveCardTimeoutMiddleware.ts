import { CREATE_NEW_THREAD } from '../../thread-create/constants/actionTypes';
import { cancelAllPendingTimeouts } from '../actions/interactiveCardTimeouts';
function shouldCancelTimeouts(action) {
  return action.type === CREATE_NEW_THREAD.SUCCEEDED;
}
export const interactiveCardTimeoutMiddleware = () => next => action => {
  const result = next(action);
  if (shouldCancelTimeouts(action)) {
    cancelAllPendingTimeouts();
  }
  return result;
};