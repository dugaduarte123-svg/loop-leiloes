import { decorate } from '../definition/decorator';
import { registryDevtools } from './registryDevtools';
import { getDefaultHttpClient } from '../../client/defaultHttpClient';
import { Metrics } from '../../metrics/metrics';
import { createPersistenceDecorator } from '../../persistence/decorator';
import { lifecycleRules } from '../decorators/lifecycleRules';
import { changeHandling } from '../decorators/changeHandling';
import { createUnwatchManager } from '../../client/unwatchManager';
let __TEST_ONLY_DISABLE_RESOLVER_DEFER = false;
export const __testOnlyDisableResolverDefer = () => {
  __TEST_ONLY_DISABLE_RESOLVER_DEFER = true;
};
export const __testOnlyEnableResolverDefer = () => {
  __TEST_ONLY_DISABLE_RESOLVER_DEFER = false;
};
export const createResolverRegistry = ({
  logger,
  persistenceManager
}) => {
  const registeredResolvers = new Map();
  const registeredMockResolvers = new WeakMap();
  const attachments = new Map();
  const refcounts = new Map();
  const teardown = instanceKey => {
    const attachment = attachments.get(instanceKey);
    if (!attachment) {
      return;
    }
    attachment.detach();
    attachments.delete(instanceKey);
  };
  const detachManager = createUnwatchManager(teardown);
  logger === null || logger === void 0 || logger.debug('startup');
  return {
    isAttached: instanceKey => attachments.has(instanceKey),
    attach: ({
      resource,
      instanceKey,
      params,
      resolver: resolverArg,
      getState,
      onResolverUpdate,
      httpClient
    }) => {
      var _refcounts$get;
      const attachLogger = logger === null || logger === void 0 ? void 0 : logger.withTags({
        instanceKey
      });
      detachManager.clear(instanceKey);
      refcounts.set(instanceKey, ((_refcounts$get = refcounts.get(instanceKey)) !== null && _refcounts$get !== void 0 ? _refcounts$get : 0) + 1);
      if (attachments.has(instanceKey)) {
        return false;
      }
      const {
        typeName,
        persist
      } = resource;
      const applyDecorators = target => [lifecycleRules, ...(persistenceManager && persist ? [createPersistenceDecorator(persistenceManager, persist)] : []), changeHandling].reduce((decorated, decorator) => decorated.with(decorator), decorate(target));

      // Mock resolvers are cached by identity rather than by typeName, so a
      // type can have a mocked instance and a real instance attached at the
      // same time (mock.static seeds specific params; the rest fall through).
      let resolver;
      if (process.env.NODE_ENV !== 'production' && resolverArg !== resource.resolver) {
        if (!registeredMockResolvers.has(resolverArg)) {
          attachLogger === null || attachLogger === void 0 || attachLogger.info('registering mock resolver');
          registeredMockResolvers.set(resolverArg, applyDecorators(resolverArg));
        }
        resolver = registeredMockResolvers.get(resolverArg);
      } else {
        if (!registeredResolvers.has(typeName)) {
          attachLogger === null || attachLogger === void 0 || attachLogger.info('registering resolver');
          registeredResolvers.set(typeName, applyDecorators(resolverArg));
        }
        resolver = registeredResolvers.get(typeName);
      }
      attachLogger === null || attachLogger === void 0 || attachLogger.debug('attaching resolver');
      const defaultHttpClient = getDefaultHttpClient();
      if (httpClient && httpClient !== defaultHttpClient) {
        Metrics.counter('custom-http-client').increment();
      }
      attachments.set(instanceKey, resolver.attach(params, {
        next: onResolverUpdate,
        getState,
        env: {
          httpClient: httpClient !== null && httpClient !== void 0 ? httpClient : defaultHttpClient,
          instanceKey,
          resource,
          logger: attachLogger === null || attachLogger === void 0 ? void 0 : attachLogger.withTags({
            component: 'resolver'
          })
        }
      }));
      return true;
    },
    detach: instanceKey => {
      var _refcounts$get2;
      const detachLogger = logger === null || logger === void 0 ? void 0 : logger.withTags({
        instanceKey
      });
      const remaining = ((_refcounts$get2 = refcounts.get(instanceKey)) !== null && _refcounts$get2 !== void 0 ? _refcounts$get2 : 0) - 1;
      if (remaining > 0) {
        refcounts.set(instanceKey, remaining);
        return;
      }
      refcounts.delete(instanceKey);
      detachLogger === null || detachLogger === void 0 || detachLogger.info('detaching resolver');
      if (__TEST_ONLY_DISABLE_RESOLVER_DEFER) {
        teardown(instanceKey);
      } else {
        detachManager.queue(instanceKey);
      }
    },
    refresh: (instanceKey, changeContext) => {
      const refreshLogger = logger === null || logger === void 0 ? void 0 : logger.withTags({
        instanceKey,
        changeId: changeContext === null || changeContext === void 0 ? void 0 : changeContext.changeId,
        originId: changeContext === null || changeContext === void 0 ? void 0 : changeContext.originId
      });
      const attachment = attachments.get(instanceKey);
      if (!attachment) {
        refreshLogger === null || refreshLogger === void 0 || refreshLogger.error('no attachment found');
        throw Error(`Attempting to refresh ${instanceKey} but no attachment found`);
      }
      refreshLogger === null || refreshLogger === void 0 || refreshLogger.info('refreshing resolver');
      attachment.refresh(changeContext);
    },
    __devtools: registryDevtools(registeredResolvers)
  };
};