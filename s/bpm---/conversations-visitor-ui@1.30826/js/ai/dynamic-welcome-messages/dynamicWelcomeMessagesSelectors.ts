import get from 'transmute/get';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
export const getDynamicWelcomeMessages = state => {
  var _ref;
  return (_ref = get('dynamicWelcomeMessages', getLatestWidgetData(state))) !== null && _ref !== void 0 ? _ref : [];
};
export const hasDynamicWelcomeMessages = state => getDynamicWelcomeMessages(state).length > 0;