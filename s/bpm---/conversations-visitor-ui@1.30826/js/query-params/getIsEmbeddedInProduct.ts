import { getWindowLocation } from './getWindowLocation';
import { parseStringBoolean } from '../utils/parseStringBoolean';
export const getIsEmbeddedInProduct = () => {
  return parseStringBoolean(getWindowLocation().paramValue('inApp53'));
};