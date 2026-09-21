import { getStatus } from './threadGetters';
import ChatFilterOptions from 'conversations-internal-schema/constants/ChatFilterOptions';
export function isStarted(conversation) {
  return getStatus(conversation) === ChatFilterOptions.STARTED;
}