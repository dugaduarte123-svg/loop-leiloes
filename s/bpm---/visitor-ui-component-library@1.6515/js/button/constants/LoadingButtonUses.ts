import * as ButtonUses from './ButtonUses';
import * as SpinnerUses from '../../loading/constants/SpinnerUses';
export const PRIMARY = 'primary';
export const SECONDARY = 'secondary';
const LoadingButtonUses = {
  PRIMARY,
  SECONDARY
};
const loadingButtonToButtonMap = {
  [PRIMARY]: ButtonUses.PRIMARY,
  [SECONDARY]: ButtonUses.SECONDARY
};
export const buttonUse = loadingButtonUse => loadingButtonToButtonMap[loadingButtonUse];
const loadingButtonToSpinnerMap = {
  [PRIMARY]: SpinnerUses.SECONDARY,
  [SECONDARY]: SpinnerUses.PRIMARY
};
export const spinnerUse = loadingButtonUse => loadingButtonToSpinnerMap[loadingButtonUse];
export default LoadingButtonUses;