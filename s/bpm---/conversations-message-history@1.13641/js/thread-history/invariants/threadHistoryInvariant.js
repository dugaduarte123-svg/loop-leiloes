'use es6';

import invariant from 'react-utils/invariant';
import ThreadHistory from '../records/ThreadHistory';
export const threadHistoryInvariant = threadHistory => invariant(threadHistory instanceof ThreadHistory, 'Expected threadHistory to be a `ThreadHistory` not a `%s`', typeof threadHistory);