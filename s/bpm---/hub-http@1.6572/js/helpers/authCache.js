'use es6';

const CACHE_KEY_PREFIX = 'hapijs_options'; // reuse data from hapijs

const cacheKey = options => `${CACHE_KEY_PREFIX}:${options.portalId}`;
const cache = {
    get(options) {
        const item = options.localStorage && options.localStorage.getItem(cacheKey(options));
        return item ? JSON.parse(item) : {};
    },
    set(options, value) {
        if (!options.localStorage) return;
        options.localStorage.setItem(cacheKey(options), JSON.stringify(value));
    },
    clear(options) {
        if (!options.localStorage) return;
        options.localStorage.removeItem(cacheKey(options));
    }
};
export default cache;