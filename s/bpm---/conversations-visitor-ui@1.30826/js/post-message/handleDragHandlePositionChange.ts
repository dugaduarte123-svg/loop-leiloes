import { DRAG_HANDLE_POSITION_CHANGE } from '../constants/PostMessageTypes';
import { postMessageToParent } from './postMessageToParent';
export const handleDragHandlePositionChange = ({
  dragHandleState
}) => postMessageToParent(DRAG_HANDLE_POSITION_CHANGE, {
  dragHandleState
});