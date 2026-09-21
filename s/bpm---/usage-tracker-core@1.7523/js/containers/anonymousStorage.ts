import * as browserHelper from '../client/browserHelper';
import { lWindow } from '../common/helpers';

// @TODO: This should be moved to the `client` folder as it is a Browser API
const getItem = (key = '') => {
  if (browserHelper.hasLocalStorage) {
    try {
      return lWindow.sessionStorage.getItem(key) || '';
    } catch (err) {
      // noop
    }
  }
  return null;
};

// @TODO: This should be moved to the `client` folder as it is a Browser API
const setItem = (key = '', value = '') => {
  if (browserHelper.hasLocalStorage) {
    try {
      lWindow.sessionStorage.setItem(key, value || '');
    } catch (err) {
      // noop
    }
  }
  return value;
};

// @TODO: This should be moved to the `client` folder as it is a Browser API
const removeItem = (key = '') => {
  if (browserHelper.hasLocalStorage) {
    try {
      lWindow.sessionStorage.removeItem(key);
    } catch (err) {
      // noop
    }
  }
};
export default {
  getItem,
  setItem,
  removeItem
};