import { getWindowLocation } from './getWindowLocation';
export function getMessagesUtk() {
  const url = getWindowLocation();
  const path = url.pathname;
  const utkIndex = path.indexOf('/utk/');
  const messagesUtkPathValue = path.slice(utkIndex).split('/').pop();
  const shouldUsePathValue = messagesUtkPathValue !== 'null' && utkIndex !== -1;
  return shouldUsePathValue ? messagesUtkPathValue : url.paramValue('messagesUtk');
}