import { getWindowLocation } from './getWindowLocation';
export const getHSTC = () => {
  return getWindowLocation().paramValue('hstc');
};