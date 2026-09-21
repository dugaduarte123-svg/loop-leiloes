import styled from 'styled-components';
import { NEUTRAL_800, NEUTRAL_1600 } from 'visitor-ui-component-library/constants/WidgetColors';
import { getFocusRingStyles } from 'visitor-ui-component-library/utils/getFocusRingStyles';
const MenuItem = styled.button.withConfig({
  displayName: "MenuItem"
})(["display:flex;align-items:center;gap:8px;width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:", ";font-size:14px;color:", ";white-space:nowrap;transition:background-color 0.2s ease;&:hover:not(:disabled){background-color:rgba(0,0,0,0.04);}", ""], ({
  $disabled
}) => $disabled ? 'not-allowed' : 'pointer', ({
  $disabled
}) => $disabled ? NEUTRAL_800 : NEUTRAL_1600, getFocusRingStyles({
  outlineOffset: '-2px'
}));
export default MenuItem;