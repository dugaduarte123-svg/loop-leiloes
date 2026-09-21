import { getWindowLocation } from './getWindowLocation';
import { parseStringBoolean } from '../utils/parseStringBoolean';
export const getIsFirstVisitorSessionParam = () => {
  return parseStringBoolean(getWindowLocation().paramValue('isFirstVisitorSession'));
};