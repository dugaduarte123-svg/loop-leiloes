import { createDecorator } from '../definition/decorator';
export const lifecycleRules = createDecorator('lifecycleRules', attach => (baseParams, runtime) => {
  let detached = false;
  const lifecycle = attach(baseParams, Object.assign({}, runtime, {
    next: state => {
      if (!detached) {
        runtime.next(state);
      } else {
        var _runtime$env$logger;
        (_runtime$env$logger = runtime.env.logger) === null || _runtime$env$logger === void 0 || _runtime$env$logger.debug('no-opping state change after detach');
      }
    }
  }));
  return Object.assign({}, lifecycle, {
    detach: () => {
      lifecycle.detach();
      detached = true;
    }
  });
});