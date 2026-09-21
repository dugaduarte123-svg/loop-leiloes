import { NEUTRAL_700 } from 'visitor-ui-component-library/constants/WidgetColors';
export const TOOLTIP_CONTENT_STYLE = {
  padding: '6px 10px',
  border: `1px solid ${NEUTRAL_700}`,
  borderRadius: '6px'
};
export const TOOLTIP_ARROW_STYLE = {
  border: `1px solid ${NEUTRAL_700}`
};
export const TOOLTIP_CONTENT_STYLE_NARROW = Object.assign({}, TOOLTIP_CONTENT_STYLE, {
  maxWidth: 160
});