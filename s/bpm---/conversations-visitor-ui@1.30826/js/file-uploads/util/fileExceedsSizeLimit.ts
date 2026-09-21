import { MAX_FILE_SIZE, MAX_FILE_SIZE_PORTAL_53 } from '../constants/fileUploadsConstants';
import { getIsPortal53 } from '../../widget-data/operators/getIsPortal53';
export const fileExceedsSizeLimit = file => {
  return getIsPortal53() ? file.size > MAX_FILE_SIZE_PORTAL_53 : file.size > MAX_FILE_SIZE;
};