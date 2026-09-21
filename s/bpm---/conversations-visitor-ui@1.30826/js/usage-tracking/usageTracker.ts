import once from 'hs-lodash/once';
import { getMessagesUtk } from '../query-params/getMessagesUtk';
import { makeUsageTracker } from './factories/makeUsageTracker';
const makeUsageTrackerSingleton = () => makeUsageTracker({
  messagesUtk: getMessagesUtk()
});
export const getUsageTracker = once(makeUsageTrackerSingleton);