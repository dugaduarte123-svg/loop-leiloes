import { List, Map as ImmutableMap, Record } from 'immutable';
import { FILES } from '../constants/attachmentTypes';
const FileAttachment = Record({
  '@type': FILES,
  fileIds: List(),
  fileUsageTypes: ImmutableMap(),
  strippedAttachmentCount: 0
}, 'FileAttachment');
export default FileAttachment;