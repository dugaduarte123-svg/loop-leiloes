import { createSelector } from '@reduxjs/toolkit';
import { getAfterHoursAutoReplyMessage } from './getAfterHoursAutoReplyMessage';
export const getAllowVisitorOfflineMessaging = createSelector([getAfterHoursAutoReplyMessage], afterHoursAutoReplyMessage => Boolean(afterHoursAutoReplyMessage));