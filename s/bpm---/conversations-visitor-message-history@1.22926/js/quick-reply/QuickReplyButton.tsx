import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["accentColor", "children", "onClick", "variant"];
import styled, { css } from 'styled-components';
import { getCanReadTextOnce } from 'visitor-ui-component-library/utils/colors';
import { OBSIDIAN, NEUTRAL_200, NEUTRAL_300, NEUTRAL_800, NEUTRAL_900, WHITE } from 'visitor-ui-component-library/constants/WidgetColors';
import { getFocusRingStyles } from 'visitor-ui-component-library/utils/getFocusRingStyles';
import { promptButtonBaseStyles } from '../shared/components/BasePromptButton';
import { QUICK_REPLY_VARIANT } from './constants/quickReplies';
import { jsx as _jsx } from "react/jsx-runtime";
const defaultVariantStyles = css(["", " background:", ";color:", ";border:1px solid ", ";cursor:pointer;&:hover:not(:disabled){color:", ";border-color:", ";}&:disabled{opacity:0.6;cursor:not-allowed;}"], promptButtonBaseStyles, WHITE, OBSIDIAN, NEUTRAL_800, ({
  $accentColor
}) => $accentColor || NEUTRAL_900, ({
  $accentColor
}) => $accentColor || NEUTRAL_900);
const spotlightVariantStyles = css(["display:flex;align-items:center;gap:", ";background:", ";color:", ";border:1.5px solid ", ";border-radius:", ";padding:", ";font-size:", ";font-weight:", ";line-height:", ";cursor:pointer;box-sizing:border-box;text-align:left;transition:background-color 0.15s ease,border-color 0.15s ease;&:hover{background-color:", ";border:1.5px solid ", ";}&:active{background-color:", ";border:1.5px solid ", ";}", ""], ({
  theme
}) => theme.spotlight.spacing.sm, ({
  theme
}) => theme.spotlight.color.surface, ({
  theme
}) => theme.spotlight.color.ink, ({
  theme
}) => theme.spotlight.color.selectedStroke, ({
  theme
}) => theme.spotlight.borderRadius.pill, ({
  theme
}) => `${theme.spotlight.spacing.sm} ${theme.spotlight.spacing.lg}`, ({
  theme
}) => theme.spotlight.typography.fontSize.xl, ({
  theme
}) => theme.spotlight.typography.fontWeight.regular, ({
  theme
}) => theme.spotlight.typography.lineHeight.lg, NEUTRAL_200, NEUTRAL_800, NEUTRAL_300, NEUTRAL_800, getFocusRingStyles({
  outlineOffset: '2px'
}));
const QuickReplyButtonStyled = styled.button.withConfig({
  displayName: "QuickReplyButton__QuickReplyButtonStyled"
})(["", ""], ({
  $variant
}) => $variant === QUICK_REPLY_VARIANT.SPOTLIGHT ? spotlightVariantStyles : defaultVariantStyles);
const QuickReplyButton = _ref => {
  let {
      accentColor = OBSIDIAN,
      children,
      onClick,
      variant = QUICK_REPLY_VARIANT.DEFAULT
    } = _ref,
    props = _objectWithoutPropertiesLoose(_ref, _excluded);
  const isTextReadable = getCanReadTextOnce(accentColor);
  const accessibleAccentColor = isTextReadable ? accentColor : OBSIDIAN;
  return /*#__PURE__*/_jsx(QuickReplyButtonStyled, Object.assign({
    $accentColor: accessibleAccentColor,
    $variant: variant,
    onClick: onClick
  }, props, {
    children: children
  }));
};
QuickReplyButton.displayName = 'QuickReplyButton';
export default QuickReplyButton;