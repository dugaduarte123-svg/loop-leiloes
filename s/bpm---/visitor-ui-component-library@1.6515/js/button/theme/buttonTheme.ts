import { css } from 'styled-components';
import { focusRing } from '../../utils/mixins';
import { adjustLuminance } from '../../utils/adjustLuminance';
import { BUTTON_PADDINGS, BUTTON_FONT_SIZES } from '../constants/ButtonSizes';
export const buttonTheme = {
  baseStyle: css(["font-family:inherit;padding:", ";font-size:", ";flex-shrink:0;border-radius:3px;line-height:16px;outline:none;transition:background-color 150ms ease-out;border-style:solid;border-width:1px;cursor:pointer;text-align:center;word-break:normal;overflow-wrap:break-word;background-color:transparent;", ""], ({
    size
  }) => BUTTON_PADDINGS[size], ({
    size
  }) => BUTTON_FONT_SIZES[size], ({
    theme: {
      colors
    },
    use
  }) => use === 'primary' ? `
          background-color: ${colors.primary};
          border: none;
          color: ${colors.textOnPrimary};
        ` : `
          background-color: transparent;
          border-color: ${colors.primary};
          color: ${colors.primary};
        `),
  _disabled: css(["background-color:", ";border:1px solid ", ";color:", ";cursor:not-allowed;user-select:none;"], ({
    theme: {
      colors
    }
  }) => colors.disabledButtonBackground, ({
    theme: {
      colors
    }
  }) => colors.disabledButtonBorder, ({
    theme: {
      colors
    }
  }) => colors.disabledButtonText),
  _focused: focusRing,
  _hovered: css(["", ""], ({
    theme: {
      colors
    },
    use
  }) => `background-color: ${adjustLuminance(colors.primary, use === 'primary' ? 20 : 95)};`),
  _pressed: css(["", ""], ({
    theme: {
      colors
    },
    use
  }) => `background-color: ${adjustLuminance(colors.primary, use === 'primary' ? -10 : 90)};`)
};