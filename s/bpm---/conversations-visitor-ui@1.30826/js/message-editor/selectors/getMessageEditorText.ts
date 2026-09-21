import { getSelectedThreadId } from '../../selected-thread/selectors/getSelectedThreadId';
export const getMessageEditorText = state => {
  var _state$messageEditorS;
  const threadId = getSelectedThreadId(state);
  return ((_state$messageEditorS = state.messageEditorStaging[threadId]) === null || _state$messageEditorS === void 0 ? void 0 : _state$messageEditorS.stagingText) || '';
};