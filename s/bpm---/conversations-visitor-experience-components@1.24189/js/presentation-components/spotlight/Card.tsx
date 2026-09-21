import styled from 'styled-components';
import VizExCard from 'visitor-ui-component-library/card/VizExCard';
import { jsx as _jsx } from "react/jsx-runtime";
const StyledCard = styled(VizExCard).withConfig({
  displayName: "Card__StyledCard"
})(["box-shadow:", ";background:", ";box-sizing:border-box;width:auto;margin-bottom:0;"], ({
  theme
}) => theme.spotlight.shadow.card, ({
  theme
}) => theme.spotlight.color.surface);
const Card = ({
  children,
  className
}) => /*#__PURE__*/_jsx(StyledCard, {
  className: className,
  children: children
});
Card.displayName = 'Card';
export default Card;