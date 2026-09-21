'use es6';

const labEnabled = (labKey, options) => {
    const localStorageKey = `HUB-HTTP-LABS:${labKey}`;
    const labOverride = options.localStorage && options.localStorage.getItem(localStorageKey);
    if (labOverride && labOverride.toLowerCase() === 'true') {
        // eslint-disable-next-line no-console
        console.log(`Using localStorage override for ${localStorageKey}: ${labOverride}`);
        return labOverride.toLowerCase() === 'true';
    }
    return typeof options.labs === 'object' && options.labs[labKey];
};
export const lab = (labKey, middleware, fallback = o => o) => options => labEnabled(labKey, options) ? middleware(options) : fallback(options);