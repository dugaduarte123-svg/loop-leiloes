import { SIZE_LIMIT_EXCEEDED } from '../constants/attachmentErrors';
export const validationErrorToTrackingFailureType = errorType => {
  switch (errorType) {
    case SIZE_LIMIT_EXCEEDED:
      return 'size limit exceeded';
    default:
      return null;
  }
};