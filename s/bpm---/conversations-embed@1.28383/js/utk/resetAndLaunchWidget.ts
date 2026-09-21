import { clearCookies } from '../cookies/clearCookies';
import { startOnceReady } from '../startOnceReady';
import { USER_TOKEN_KEY } from './constants';
export const resetAndLaunchWidget = () => {
  clearCookies();
  window[USER_TOKEN_KEY] = '';
  window.hubspot_live_messages_running = false;
  startOnceReady();
};