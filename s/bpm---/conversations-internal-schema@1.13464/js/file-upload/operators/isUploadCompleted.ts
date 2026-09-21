import { getFileId } from './fileUploadGetters';
export const isUploadCompleted = fileUpload => {
  const fileId = getFileId(fileUpload);
  return fileId !== -1;
};