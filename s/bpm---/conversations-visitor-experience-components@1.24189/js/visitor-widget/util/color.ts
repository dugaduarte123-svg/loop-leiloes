import { getTextColor, useDefaultElementColor } from 'visitor-ui-component-library/utils/colors';
import { OBSIDIAN, OZ_MEDIUM, NORMAN_DARK, MARIGOLD, THUNDERDOME_DARK } from 'visitor-ui-component-library/constants/WidgetColors';
import WidgetColoring from 'conversations-internal-schema/coloring/model/WidgetColoring';
export const FIRST_COLOR = OBSIDIAN;
export const SECOND_COLOR = OZ_MEDIUM;
export const THIRD_COLOR = NORMAN_DARK;
export const FOURTH_COLOR = MARIGOLD;
export const FIFTH_COLOR = THUNDERDOME_DARK;
export const DEFAULT_CUSTOM_COLOR = THUNDERDOME_DARK;
export const getBrandStyle = accentColor => {
  switch (accentColor) {
    case FIRST_COLOR:
      return {
        backgroundImage: 'linear-gradient(90deg, #33475B 0%, #516F90 101.34%)'
      };
    case SECOND_COLOR:
      return {
        backgroundImage: 'linear-gradient(90deg, #7FDED2 0%, #7FD1DE 100%)'
      };
    case THIRD_COLOR:
      return {
        backgroundImage: 'linear-gradient(90deg, #C84676 0%, #965EB8 100%)'
      };
    case FOURTH_COLOR:
      return {
        backgroundImage: 'linear-gradient(92.06deg, #F5C26B 23.41%, #FF9980 100%)'
      };
    case FIFTH_COLOR:
      return {
        backgroundImage: 'linear-gradient(92.06deg, #5E6AB8 42.78%, #2B7ABF 100%)'
      };
    default:
      return {
        backgroundColor: accentColor
      };
  }
};
export function buildWidgetColoring(accentColor) {
  if (accentColor == null) {
    return WidgetColoring();
  }
  return WidgetColoring({
    accentColor,
    textColor: getTextColor(accentColor),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDefaultColor: useDefaultElementColor(accentColor)
  });
}