import { createSelector } from '@reduxjs/toolkit';
// @ts-ignore Untyped import
import { calculateUnseenThreadsCount } from '../../threads/selectors/calculateUnseenThreadsCount';
import { getIsOpen } from '../../selectors/getIsOpen';
export const getShowLauncherBadge = createSelector([getIsOpen, calculateUnseenThreadsCount], (isOpen, unseenThreadsCount) => {
  return Boolean(!isOpen && !!unseenThreadsCount);
});