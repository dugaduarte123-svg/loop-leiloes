import { buildErrorMetaObject } from './buildErrorMetaObject';

/**
 * @description Build a error meta action to silence floating error alerts
 * w/ an ignore rule for certain status codes
 * @returns {Object} Meta Action
 *
 *  @example
 *  const pollThreadListFailed = createAction(
 *    POLL_THREAD_LISTS_FAILED,
 *    error => ({ error }),
 *    silenceErrorAlert({ ignoreStatusCodes: [404, 0], error })
 *  );
 *  @example
 *  const pollThreadListFailed = createAction(
 *    POLL_THREAD_LISTS_FAILED,
 *    error => ({ error }),
 *    silenceErrorAlert
 *  );
 *
 */

export const silenceErrorAlert = ({
  isVisibleToUser = false,
  ignoreStatusCodes = [0],
  ignore = false,
  error
} = {}) => {
  if (error && ignoreStatusCodes.some(code => code === error.status)) {
    ignore = true;
  }
  return buildErrorMetaObject({
    silent: true,
    isVisibleToUser,
    ignore
  });
};