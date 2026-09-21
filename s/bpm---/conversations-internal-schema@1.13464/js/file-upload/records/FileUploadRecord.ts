import { Record } from 'immutable';
import { generateIdForFile } from '../util/generateIdForFile';
class FileUploadRecord extends Record({
  file: null,
  localId: '',
  fileId: -1,
  uploadProgress: 0
}, 'FileUploadRecord') {
  constructor(properties = {}) {
    super(Object.assign({}, properties, {
      localId: generateIdForFile({
        file: properties.file || null,
        timestamp: Date.now()
      })
    }));
  }
}
export default FileUploadRecord;