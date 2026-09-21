import { getStandardHeaders } from '../utilities';
export const setStandardHeaders = (params, context) => {
  var _params$init;
  const standardHeaders = getStandardHeaders(context.gateway, context.cookie);
  const updatedHeaders = Object.assign({}, (_params$init = params.init) === null || _params$init === void 0 ? void 0 : _params$init.headers, standardHeaders);
  return Object.assign({}, params, {
    init: Object.assign({}, params.init, {
      headers: updatedHeaders
    })
  });
};