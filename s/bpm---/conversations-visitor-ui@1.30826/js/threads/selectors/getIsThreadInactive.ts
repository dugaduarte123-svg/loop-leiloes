// @ts-ignore untyped module
import { getSelectedThread } from '../../selected-thread/selectors/getSelectedThread';
import { isStarted } from '../operators/isStarted';
import { getHasChannelSwitchedToEmail } from '../operators/threadGetters';
export const getIsThreadInactive = state => {
  const thread = getSelectedThread(state);
  return Boolean(thread && (!isStarted(thread) || getHasChannelSwitchedToEmail(thread)));
};