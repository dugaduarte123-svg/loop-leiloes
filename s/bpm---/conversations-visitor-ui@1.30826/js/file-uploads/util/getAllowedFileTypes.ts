import { ALLOWED_FILE_TYPES } from 'conversations-internal-schema/file-metadata/constants/allowedFileTypes';
import { getIsPortal53 } from '../../widget-data/operators/getIsPortal53';
export default function getAllowedFileTypes() {
  if (getIsPortal53()) {
    return ['.har', ...ALLOWED_FILE_TYPES];
  }
  return ALLOWED_FILE_TYPES;
}