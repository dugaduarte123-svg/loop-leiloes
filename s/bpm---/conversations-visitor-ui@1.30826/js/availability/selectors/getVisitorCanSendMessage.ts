// @ts-ignore untyped module
import { getSelectedThread } from '../../selected-thread/selectors/getSelectedThread';
import { isPersistedThread } from '../../threads/operators/isPersistedThread';
import { getIsWidgetInAwayMode } from './getIsWidgetInAwayMode';
import { getAfterHoursAutoReplyMessage } from './getAfterHoursAutoReplyMessage';
export const getVisitorCanSendMessage = state => {
  const selectedThread = getSelectedThread(state);
  return Boolean(getAfterHoursAutoReplyMessage(state)) || !getIsWidgetInAwayMode(state) || selectedThread !== null && isPersistedThread(selectedThread);
};