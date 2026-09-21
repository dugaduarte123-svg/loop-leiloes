// @ts-ignore Untyped import
import { handleActions } from 'flux-actions';
import { UPDATE_GLOBAL_COOKIE_OPT_OUT, UPDATE_IS_FIRST_VISITOR_SESSION } from '../constants/ActionTypes';
import VisitorIdentity from '../records/VisitorIdentity';
import { setGlobalCookieOptOut } from '../operators/setGlobalCookieOptOut';
import { setIsFirstVisitorSession } from '../operators/setIsFirstVisitorSession';
const visitorIdentity = handleActions({
  [UPDATE_GLOBAL_COOKIE_OPT_OUT](state, action) {
    const {
      globalCookieOptOut
    } = action.payload;
    return setGlobalCookieOptOut(globalCookieOptOut, state);
  },
  [UPDATE_IS_FIRST_VISITOR_SESSION](state, action) {
    const {
      isFirstVisitorSession
    } = action.payload;
    return setIsFirstVisitorSession(isFirstVisitorSession, state);
  }
}, new VisitorIdentity());
export default visitorIdentity;