import { checkDevtoolsEnabled } from './checkDevtoolsEnabled';
const NOOP = {
  devtoolsId: null,
  registerHooks: () => {}
};
export const maybeLoadDevtools = ({
  clientId,
  logger
}) => {
  if (checkDevtoolsEnabled()) {
    let deferredRegisterArgs = null;
    let real = null;
    const callbackQueue = [];
    const devtools = {
      devtoolsId: clientId,
      callbacks: new Proxy({}, {
        get: (__, method) => (...args) => {
          if (real) {
            var _real$callbacks, _real$callbacks$metho;
            (_real$callbacks = real.callbacks) === null || _real$callbacks === void 0 || (_real$callbacks$metho = _real$callbacks[method]) === null || _real$callbacks$metho === void 0 || _real$callbacks$metho.call(_real$callbacks, ...args);
          } else {
            callbackQueue.push({
              method,
              args
            });
          }
        }
      }),
      registerHooks: args => {
        if (real) {
          real.registerHooks(args);
        } else {
          deferredRegisterArgs = args;
        }
      }
    };
    logger === null || logger === void 0 || logger.debug('loading devtools');
    import('./deferred/devtools').then(({
      createDevtools
    }) => {
      logger === null || logger === void 0 || logger.info('devtools chunk loaded');
      real = createDevtools({
        devtoolsId: clientId,
        logger
      });

      // Should never happen, as register is called sync, but might as well
      // guard against it
      if (deferredRegisterArgs) {
        real.registerHooks(deferredRegisterArgs);
      }
      for (const {
        method,
        args
      } of callbackQueue) {
        var _real$callbacks2, _real$callbacks2$meth, _real$callbacks3;
        (_real$callbacks2 = real.callbacks) === null || _real$callbacks2 === void 0 || (_real$callbacks2$meth = (_real$callbacks3 = _real$callbacks2)[method]) === null || _real$callbacks2$meth === void 0 || _real$callbacks2$meth.call(_real$callbacks3, ...args);
      }

      // Clear the callback queue to release memory
      callbackQueue.length = 0;
    }).catch(err => {
      console.error('Error loading devtools', err);
    });
    logger === null || logger === void 0 || logger.attachDevtools(log => {
      var _devtools$callbacks, _devtools$callbacks$o;
      (_devtools$callbacks = devtools.callbacks) === null || _devtools$callbacks === void 0 || (_devtools$callbacks$o = _devtools$callbacks.onLog) === null || _devtools$callbacks$o === void 0 || _devtools$callbacks$o.call(_devtools$callbacks, log);
    });
    return devtools;
  }
  return NOOP;
};