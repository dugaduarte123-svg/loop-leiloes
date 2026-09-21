import { SPOTLIGHT_MENU_RESIZE } from '../constants/PostMessageTypes';
import { postMessageToParent } from './postMessageToParent';
export const SPOTLIGHT_DROPDOWN_EXTRA_HEIGHT = 90;
export const handleSpotlightMenuResize = isOpen => postMessageToParent(SPOTLIGHT_MENU_RESIZE, {
  isOpen,
  extraHeight: SPOTLIGHT_DROPDOWN_EXTRA_HEIGHT
});