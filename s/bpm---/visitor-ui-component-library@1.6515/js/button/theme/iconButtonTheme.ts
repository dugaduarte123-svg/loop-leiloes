import { css } from 'styled-components';
import { focusRing } from '../../utils/mixins';
import { CIRCLE } from '../constants/IconButtonShapes';
import { BUTTON_SIZES } from '../constants/ButtonSizes';
import { adjustLuminance } from '../../utils/adjustLuminance';
import { hexToRgba } from '../../utils/hexToRgba';
import { TRANSPARENT_ON_PRIMARY, TRANSPARENT_ON_BACKGROUND, PRIMARY_TRANSPARENT_BACKGROUND, DEFAULT, DEFAULT_ON_BACKGROUND } from '../constants/IconButtonUses';
import { NEUTRAL_700 } from '../../constants/WidgetColors';
import { DEFAULT_ICON_BUTTON, DEFAULT_ICON_BUTTON_DISABLED, DEFAULT_ICON_BUTTON_HOVER } from '../../theme/ColorConstants';
export const iconButtonTheme = {
  baseStyle: css(["flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;border-radius:", ";width:", "px;height:", "px;vertical-align:middle;padding:0;text-align:center;text-overflow:clip;font-size:18px;line-height:18px;outline:none;transition:background-color 150ms ease-out;", " border:none;", " > *{user-select:none;}"], ({
    shape
  }) => shape === CIRCLE ? '50%' : '3px', ({
    size
  }) => size && BUTTON_SIZES[size] || 40, ({
    size
  }) => size && BUTTON_SIZES[size] || 40, ({
    use,
    theme: {
      colors
    }
  }) => use === TRANSPARENT_ON_BACKGROUND || use === TRANSPARENT_ON_PRIMARY || use === PRIMARY_TRANSPARENT_BACKGROUND || use === DEFAULT || use === DEFAULT_ON_BACKGROUND ? `background-color: transparent;` : `background-color: ${colors.primary};`, ({
    use,
    theme: {
      colors
    }
  }) => {
    if (use === DEFAULT || use === DEFAULT_ON_BACKGROUND) {
      return `color: ${DEFAULT_ICON_BUTTON};`;
    }
    return use === TRANSPARENT_ON_BACKGROUND || use === PRIMARY_TRANSPARENT_BACKGROUND ? `color: ${colors.transparentOnBackgroundIconButton || colors.primary};` : `color: ${colors.textOnPrimary};`;
  }),
  _disabled: css(["", " color:", ";cursor:not-allowed;"], ({
    theme: {
      colors
    },
    use
  }) => `
    background-color: ${use === TRANSPARENT_ON_BACKGROUND || use === TRANSPARENT_ON_PRIMARY || use === PRIMARY_TRANSPARENT_BACKGROUND || use === DEFAULT || use === DEFAULT_ON_BACKGROUND ? 'transparent' : colors.disabledBackground};
  `, ({
    theme: {
      colors
    },
    use
  }) => use === DEFAULT || use === DEFAULT_ON_BACKGROUND ? DEFAULT_ICON_BUTTON_DISABLED : colors.disabledText),
  _focused: focusRing,
  _hovered: css(["", ""], ({
    theme: {
      colors
    },
    use
  }) => {
    if (use === DEFAULT) {
      return `background-color: transparent; color: ${DEFAULT_ICON_BUTTON_HOVER};`;
    }
    if (use === DEFAULT_ON_BACKGROUND) {
      return `background-color: ${hexToRgba(DEFAULT_ICON_BUTTON, 0.1)}; color: ${DEFAULT_ICON_BUTTON};`;
    }
    if (use === TRANSPARENT_ON_BACKGROUND) {
      return `background-color: ${hexToRgba(colors.transparentOnBackgroundIconButton || colors.primary, 0.1)};`;
    }
    if (use === PRIMARY_TRANSPARENT_BACKGROUND) {
      return `background-color: transparent; color: ${NEUTRAL_700};`;
    }
    if (use === TRANSPARENT_ON_PRIMARY) {
      return `background-color: ${hexToRgba(colors.textOnPrimary, 0.1)};`;
    }
    return `background-color: ${adjustLuminance(colors.primary, 20)};`;
  }),
  _pressed: css(["", ""], ({
    theme: {
      colors
    },
    use
  }) => {
    if (use === DEFAULT) {
      return `background-color: transparent; color: ${DEFAULT_ICON_BUTTON_HOVER}; opacity: 0.8;`;
    }
    if (use === DEFAULT_ON_BACKGROUND) {
      return `background-color: ${hexToRgba(DEFAULT_ICON_BUTTON, 0.4)};`;
    }
    if (use === TRANSPARENT_ON_BACKGROUND) {
      return `background-color: ${hexToRgba(colors.transparentOnBackgroundIconButton || colors.primary, 0.4)};`;
    }
    if (use === TRANSPARENT_ON_PRIMARY) {
      return `background-color: ${hexToRgba(colors.textOnPrimary, 0.4)};`;
    }
    if (use === PRIMARY_TRANSPARENT_BACKGROUND) {
      return `opacity: 0.4;`;
    }
    return `background-color: ${adjustLuminance(colors.primary, -10)};`;
  })
};