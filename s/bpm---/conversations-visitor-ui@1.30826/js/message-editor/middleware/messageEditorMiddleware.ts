import { handleInputTextChanged } from '../../post-message/handleInputTextChanged';
import { setMessageEditorTextAction } from '../../actions/messageEditorActions';
const sendPostMessageOnTextChange = action => {
  if (setMessageEditorTextAction.match(action)) {
    const {
      stagingText
    } = action.payload;
    handleInputTextChanged(stagingText);
  }
};
export const messageEditorMiddleware = () => next => action => {
  const result = next(action);
  sendPostMessageOnTextChange(action);
  return result;
};