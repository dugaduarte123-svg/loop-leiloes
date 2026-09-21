import styled from 'styled-components';
import { NEUTRAL_900 } from 'visitor-ui-component-library/constants/WidgetColors';
export const Section = styled.div.withConfig({
  displayName: "Section"
})(["padding:8px;"]);
export const SectionHeader = styled.div.withConfig({
  displayName: "Section__SectionHeader"
})(["font-size:14px;font-weight:600;line-height:18px;color:", ";padding:8px;"], NEUTRAL_900);