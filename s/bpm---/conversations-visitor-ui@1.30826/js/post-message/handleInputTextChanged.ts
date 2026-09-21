import { INPUT_TEXT_CHANGED } from '../constants/PostMessageTypes';
import { postMessageToParent } from './postMessageToParent';
import { getIsPortal53 } from '../widget-data/operators/getIsPortal53';
export const handleInputTextChanged = text => {
  if (!getIsPortal53()) {
    return;
  }
  return postMessageToParent(INPUT_TEXT_CHANGED, {
    text
  });
};