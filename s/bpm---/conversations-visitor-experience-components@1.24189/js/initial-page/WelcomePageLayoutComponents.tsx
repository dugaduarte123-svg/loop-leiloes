import styled from 'styled-components';
import { LEFT_ALIGNED } from '../visitor-widget/constants/WidgetLocations';
export const WelcomePageWrapper = styled.div.withConfig({
  displayName: "WelcomePageLayoutComponents__WelcomePageWrapper"
})(["position:relative;display:flex;flex-direction:column;align-items:", ";"], ({
  widgetLocation
}) => widgetLocation === LEFT_ALIGNED ? 'flex-start' : 'flex-end');
export const WelcomePageContent = styled.div.withConfig({
  displayName: "WelcomePageLayoutComponents__WelcomePageContent"
})(["margin-top:25px;display:flex;flex-direction:column;gap:10px;"]);