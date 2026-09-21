import pipe from 'transmute/pipe';
import { getThreadId } from './threadGetters';
import { STUBBED_THREAD_ID } from '../../threads/constants/stubbedThreadId';
export const isPersistedThread = pipe(getThreadId, threadId => threadId !== STUBBED_THREAD_ID);