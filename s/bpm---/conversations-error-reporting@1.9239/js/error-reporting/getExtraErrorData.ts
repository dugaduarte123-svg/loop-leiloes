import { cleanError } from './cleanError';

/**
 * @description
 * Extract useful metadata from error actions provided that they are primitive values.
 * Strings are truncated at 2000 characters.
 */
export const getExtraErrorData = error => {
  if (!error) {
    return null;
  }
  return cleanError(error, Object.keys(error));
};