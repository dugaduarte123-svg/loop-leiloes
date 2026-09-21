import { createDecorator } from '../definition/decorator';
export const changeHandling = createDecorator('changeHandling', attach => (params, runtime) => {
  let pendingContext;
  const log = message => {
    var _runtime$env$logger, _pendingContext, _pendingContext2;
    return (_runtime$env$logger = runtime.env.logger) === null || _runtime$env$logger === void 0 ? void 0 : _runtime$env$logger.debug(message, {
      changeId: (_pendingContext = pendingContext) === null || _pendingContext === void 0 ? void 0 : _pendingContext.changeId,
      originId: (_pendingContext2 = pendingContext) === null || _pendingContext2 === void 0 ? void 0 : _pendingContext2.originId
    });
  };
  const next = (state, meta) => {
    const currentPending = pendingContext;
    if (!state.loading && pendingContext) {
      log('clearing pending context');
      pendingContext = undefined;
    }
    if (currentPending || meta) {
      runtime.next(state, Object.assign({
        changeContext: currentPending
      }, meta));
    } else {
      runtime.next(state);
    }
  };
  const handle = attach(params, Object.assign({}, runtime, {
    next
  }));
  return Object.assign({}, handle, {
    refresh: changeContext => {
      if (changeContext) {
        if (!pendingContext) {
          pendingContext = changeContext;
          log('registering pending context');
        } else if (pendingContext.changeId < changeContext.changeId) {
          pendingContext = changeContext;
          log('replacing pending context');
        }
      }
      handle.refresh(changeContext);
    }
  });
});