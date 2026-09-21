import getIn from 'transmute/getIn';
import { CommonMessageAttachments } from '../records/CommonMessage';
import { FILE_IDS, FILE_USAGE_TYPES } from '../constants/fileAttachmentKeyPaths';
export const getFileIds = getIn(FILE_IDS);
export const getFileUsageTypes = getIn(FILE_USAGE_TYPES);