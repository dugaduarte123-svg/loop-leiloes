import curry from 'transmute/curry';
import updateIn from 'transmute/updateIn';
import { FRIENDLY_NAME_RESULTS } from '../constants/keyPaths';
export const mergeFriendlyNames = curry((newFriendlyNames, threadHistory) => {
  return updateIn(FRIENDLY_NAME_RESULTS, existingFriendlyNames => {
    if (!newFriendlyNames || !newFriendlyNames.length) {
      return existingFriendlyNames;
    }
    return [...new Set(existingFriendlyNames.concat(newFriendlyNames).map(name => JSON.stringify(name)))].map(stringifiedName => JSON.parse(stringifiedName));
  }, threadHistory);
});