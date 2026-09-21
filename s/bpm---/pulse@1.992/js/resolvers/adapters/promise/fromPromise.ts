import { attachPromise } from './attachPromise';
export const fromPromise = (name, fetch) => ({
  name,
  tags: ['promise'],
  attach: (params, runtime) => attachPromise(fetch, params, runtime, 'promise')
});