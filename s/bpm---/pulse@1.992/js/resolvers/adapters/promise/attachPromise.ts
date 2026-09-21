import { makeFunctionalNext } from '../../definition/resolver';
import { toError, toLoading, toSuccess } from '../../definition/resolverState';
import { Metrics } from '../../../metrics/metrics';
export const attachPromise = (fetch, params, runtime, transport) => {
  const {
    env: {
      logger
    }
  } = runtime;
  const next = makeFunctionalNext(runtime);
  let pendingRefresh = false;
  const guardedFetch = async () => {
    if (pendingRefresh) {
      logger === null || logger === void 0 || logger.debug('refresh already pending');
      return;
    }
    pendingRefresh = true;
    Metrics.counter('resolver-refresh', {
      transport
    }).increment();
    logger === null || logger === void 0 || logger.debug('fetching');
    next(toLoading());
    try {
      const data = await fetch(params);
      logger === null || logger === void 0 || logger.debug('success');
      next(toSuccess(data));
    } catch (error) {
      logger === null || logger === void 0 || logger.debug('error');
      next(toError(error));
    }
    pendingRefresh = false;
  };
  return {
    refresh: () => void guardedFetch(),
    detach: () => {}
  };
};