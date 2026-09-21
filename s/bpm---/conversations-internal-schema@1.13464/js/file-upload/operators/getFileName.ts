import get from 'transmute/get';
import { getFile } from './fileUploadGetters';
export const getFileName = fileUpload => {
  const file = getFile(fileUpload);
  if (file) {
    return get('name', file) || '';
  }
  return '';
};