import { hasPersistedThreads } from './hasPersistedThreads';
import { getIsUngatedForAiSdr } from '../../widget-data/operators/getIsUngatedForAiSdr';
export const getCanShowThreadHistoryMenu = state => hasPersistedThreads(state) && !getIsUngatedForAiSdr();