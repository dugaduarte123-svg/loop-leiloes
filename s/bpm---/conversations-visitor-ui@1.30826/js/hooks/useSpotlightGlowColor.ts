import { spotlightTheme } from 'conversations-visitor-experience-components/visitor-widget/spotlight/theme';
import { useAppSelector } from '../buildStore';
import { getColoring } from '../selectors/widgetDataSelectors/getColoring';
import { getIsPortal53 } from '../widget-data/operators/getIsPortal53';
import { getIsUngatedForSpotlightGlow } from '../widget-data/selectors/widgetDataSelectors';
export const useSpotlightGlowColor = () => {
  // useDefaultColor only signals whether accentColor is readable enough for a light icon
  // (see IconLauncher); it doesn't mean "no custom color was chosen", so it isn't checked here.
  const {
    accentColor
  } = useAppSelector(getColoring);
  const isUngatedForSpotlightGlow = useAppSelector(getIsUngatedForSpotlightGlow);
  if (getIsPortal53()) return spotlightTheme.color.orange;
  if (isUngatedForSpotlightGlow && accentColor) return accentColor;
  return undefined;
};