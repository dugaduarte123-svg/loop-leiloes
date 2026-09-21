import { createSelector } from '@reduxjs/toolkit';
import { getIsFirstVisitorSession } from '../../visitor-identity/operators/getIsFirstVisitorSession';
import { getVisitorIdentity } from '../../visitor-identity/selectors/getVisitorIdentity';
export const getHasMessagesCookieBeenSaved = createSelector([getVisitorIdentity], visitorIdentity => !getIsFirstVisitorSession(visitorIdentity));