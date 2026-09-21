import { css } from 'styled-components';
import { getTextColor } from '../../theme/defaultThemeOperators';
export const getBodyTypographyStyles = ({
  theme
}) => css(["font-family:", ";font-weight:400;font-size:14px;color:", ";line-height:24px;"], ({
  theme: {
    font: {
      fontFamily
    }
  }
}) => fontFamily, getTextColor(theme));