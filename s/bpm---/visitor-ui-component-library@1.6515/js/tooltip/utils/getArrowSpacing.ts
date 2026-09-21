import { getSide, getEdge } from './getPlacement';
import { css } from 'styled-components';
const ARROW_SIZE = 16;
const INSET = 8;
const getSideStyles = ({
  placement
}) => {
  switch (getSide(placement)) {
    case 'top':
      // Arrow points down
      return css(["transform:rotate(45deg);top:-", "px;"], ARROW_SIZE + 5);
    case 'right':
      // Arrow points left
      return css(["transform:rotate(135deg);right:-", "px;"], ARROW_SIZE + 5);
    case 'bottom':
      // Arrow points up
      return css(["transform:rotate(-135deg);bottom:-", "px;"], ARROW_SIZE + 5);
    case 'left':
      // Arrow points right
      return css(["transform:rotate(-45deg);left:-", "px;"], ARROW_SIZE + 5);
    default:
      return '';
  }
};
const getEdgeStyles = ({
  placement
}) => {
  switch (getEdge(placement)) {
    case 'top':
      // Arrow is near the bottom of the left or right side
      return css(["top:", "px;"], INSET);
    case 'middle':
      return css(["top:calc(50% - ", "px);"], ARROW_SIZE / 2);
    case 'bottom':
      // Arrow is near the top of the left or right side
      return css(["bottom:", "px;"], INSET);
    case 'left':
      // Arrow is near the right of the top or bottom side
      return css(["left:", "px;"], INSET);
    case 'center':
      return css(["left:calc(50% - ", "px);"], ARROW_SIZE / 2);
    case 'right':
      // Arrow is near the left of the top or bottom side
      return css(["right:", "px;"], INSET);
    default:
      return '';
  }
};
export const getArrowSpacing = ({
  placement
}) => css(["", ";", ";"], getSideStyles({
  placement
}), getEdgeStyles({
  placement
}));