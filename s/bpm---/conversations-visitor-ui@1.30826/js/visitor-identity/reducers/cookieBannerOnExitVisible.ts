// @ts-ignore Untyped import
import { handleActions } from 'flux-actions';
import { UPDATE_SHOW_EXIT_INTENT_COOKIE_BANNER } from '../constants/ActionTypes';
const initialState = false;
export default handleActions({
  [UPDATE_SHOW_EXIT_INTENT_COOKIE_BANNER](_state, action) {
    const {
      visible
    } = action.payload;
    return visible;
  }
}, initialState);