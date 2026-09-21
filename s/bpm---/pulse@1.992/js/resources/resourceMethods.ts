import { getPulseClient } from '../client/client';
import { normalizeResourceOptions } from './descriptors';
export const createResourceMethods = resource => {
  const isNoParams = !resource.args || resource.args.length === 0;
  if (isNoParams) {
    const empty = {};
    const noParamsMethods = {
      getState: options => getPulseClient().getState(Object.assign({
        resource,
        params: empty
      }, options)),
      watch: (callback, options) => getPulseClient().watch(Object.assign({
        resource,
        params: empty
      }, options), callback),
      invalidate: options => getPulseClient().invalidate(Object.assign({
        resource,
        params: empty
      }, options)),
      invalidateAll: () => getPulseClient().invalidateAll({
        resource
      }),
      getStates: () => getPulseClient().getStates({
        resource: resource
      }),
      setState: (state, options) => getPulseClient().setState(Object.assign({
        resource,
        params: empty,
        state
      }, options)),
      getPromise: options => getPulseClient().getPromise(Object.assign({
        resource,
        params: empty
      }, options)),
      toWatch: options => Object.assign({
        resource: resource
      }, normalizeResourceOptions(options)),
      toLoad: options => {
        var _options$mode;
        return Object.assign({
          resource: resource
        }, normalizeResourceOptions(options), {
          mode: (_options$mode = options === null || options === void 0 ? void 0 : options.mode) !== null && _options$mode !== void 0 ? _options$mode : 'fresh'
        });
      }
    };
    return noParamsMethods;
  }
  const paramsMethods = {
    getState: (params, options) => getPulseClient().getState(Object.assign({
      resource,
      params
    }, options)),
    watch: (params, callback, options) => getPulseClient().watch(Object.assign({
      resource,
      params
    }, options), callback),
    invalidate: (params, options) => getPulseClient().invalidate(Object.assign({
      resource,
      params
    }, options)),
    invalidateAll: () => getPulseClient().invalidateAll({
      resource
    }),
    getStates: () => getPulseClient().getStates({
      resource
    }),
    setState: (params, state, options) => getPulseClient().setState(Object.assign({
      resource,
      params,
      state
    }, options)),
    getPromise: (params, options) => getPulseClient().getPromise(Object.assign({
      resource,
      params
    }, options)),
    toWatch: (params, options) => Object.assign({
      resource
    }, normalizeResourceOptions(Object.assign({
      params
    }, options))),
    toLoad: (params, options) => {
      var _options$mode2;
      return Object.assign({
        resource
      }, normalizeResourceOptions(Object.assign({
        params
      }, options)), {
        mode: (_options$mode2 = options === null || options === void 0 ? void 0 : options.mode) !== null && _options$mode2 !== void 0 ? _options$mode2 : 'fresh'
      });
    }
  };
  return paramsMethods;
};