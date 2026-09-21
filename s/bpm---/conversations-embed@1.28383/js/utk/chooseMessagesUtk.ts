import { getUuid } from '../utils/hsGenerator';
export function chooseMessagesUtk({
  existingMessagesUtk
} = {}) {
  let messagesUtk;
  let isFirstVisitorSession = false;
  if (existingMessagesUtk) {
    messagesUtk = existingMessagesUtk;
  } else {
    isFirstVisitorSession = true;
    messagesUtk = getUuid();
  }
  return {
    messagesUtk,
    isFirstVisitorSession
  };
}