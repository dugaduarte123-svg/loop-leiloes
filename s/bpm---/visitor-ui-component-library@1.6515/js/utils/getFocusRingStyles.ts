import { css } from 'styled-components';
import { NEUTRAL_1600 } from '../constants/WidgetColors';
export const getFocusRingStyles = ({
  ringColor = NEUTRAL_1600,
  outlineOffset = '1px'
} = {}) => css(["&:focus-visible{outline:2px solid ", ";outline-offset:", ";}"], ringColor, outlineOffset);