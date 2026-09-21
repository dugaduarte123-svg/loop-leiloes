import { getWindowLocation } from './getWindowLocation';
import { throttledSetQueryParam } from './setQueryParam';
export const getHubspotUtk = () => {
  return getWindowLocation().paramValue('hubspotUtk');
};
export const setHubspotUtk = value => {
  const currentHubSpotUtk = getHubspotUtk();
  if (currentHubSpotUtk === value) return;
  throttledSetQueryParam({
    key: 'hubspotUtk',
    value
  });
};