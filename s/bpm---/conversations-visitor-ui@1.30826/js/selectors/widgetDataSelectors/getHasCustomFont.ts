import { createSelector } from 'reselect';
import { getFont } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
export const getHasCustomFont = createSelector(getLatestWidgetData, widgetData => {
  var _font$fontFamily;
  const font = getFont(widgetData);
  return Boolean(font && ((_font$fontFamily = font.fontFamily) === null || _font$fontFamily === void 0 ? void 0 : _font$fontFamily.toLowerCase()) !== 'system-ui');
});