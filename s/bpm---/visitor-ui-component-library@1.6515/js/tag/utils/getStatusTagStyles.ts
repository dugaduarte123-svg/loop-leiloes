import { DEFAULT, SUCCESS, WARNING, DANGER, INFO } from '../constants/TagUses';
import { getStatusTagBackgroundColor } from '../theme/vizExStatusTagOperators';
import { BATTLESHIP, OZ, MARIGOLD, CANDY_APPLE, CALYPSO } from '../../constants/WidgetColors';
export const getStatusDefaultBackgroundColor = () => BATTLESHIP;
export const getStatusSuccessBackgroundColor = () => OZ;
export const getStatusWarningBackgroundColor = () => MARIGOLD;
export const getStatusDangerBackgroundColor = () => CANDY_APPLE;
export const getStatusInfoBackgroundColor = () => CALYPSO;
export const getStatusVariationBackgroundColor = ({
  theme,
  use
}) => {
  switch (use) {
    case DEFAULT:
      {
        return getStatusDefaultBackgroundColor();
      }
    case SUCCESS:
      {
        return getStatusSuccessBackgroundColor();
      }
    case WARNING:
      {
        return getStatusWarningBackgroundColor();
      }
    case DANGER:
      {
        return getStatusDangerBackgroundColor();
      }
    case INFO:
      {
        return getStatusInfoBackgroundColor();
      }
    default:
      {
        return getStatusTagBackgroundColor(theme);
      }
  }
};