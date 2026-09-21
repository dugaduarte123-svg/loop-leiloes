import { getWindowLocation } from './getWindowLocation';
export const getWidgetShellUUID = () => {
  return getWindowLocation().paramValue('uuid');
};