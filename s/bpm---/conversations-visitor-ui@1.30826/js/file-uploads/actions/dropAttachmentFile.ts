import { selectAttachmentFile } from './selectAttachmentFile';
// @ts-ignore not typed
import { attachmentError } from './attachmentError';
import { INVALID_FILE_TYPE } from '../constants/attachmentErrors';
import { getIsPortal53 } from '../../widget-data/operators/getIsPortal53';
import { getThreadId } from '../../threads/operators/threadGetters';
export const dropAttachmentFile = (files, thread) => dispatch => {
  if (!(files !== null && files !== void 0 && files.length)) return;
  const file = files[0];
  if (/\.har$/.test(file.name) && !getIsPortal53()) {
    dispatch(attachmentError(INVALID_FILE_TYPE, getThreadId(thread)));
  } else {
    dispatch(selectAttachmentFile({
      file,
      thread,
      source: 'drag_and_drop'
    }));
  }
};