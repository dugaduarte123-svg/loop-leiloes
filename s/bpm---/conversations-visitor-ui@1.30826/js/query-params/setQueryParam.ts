import { getWindowLocation } from './getWindowLocation';
import throttle from 'hs-lodash/throttle';
const THROTTLE_HISTORY_REPLACE_STATE_MS = 300;
export const setQueryParam = ({
  key,
  value
}) => {
  const url = getWindowLocation();
  url.upsertParam(key, value);
  window.history.replaceState(null, '', url.search);
};
export const throttledSetQueryParam = throttle(({
  key,
  value
}) => setQueryParam({
  key,
  value
}), THROTTLE_HISTORY_REPLACE_STATE_MS, {
  leading: true,
  trailing: false
});