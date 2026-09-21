'use es6';

import freeze from './helpers/freeze';
const promisifyMiddleware = (mw, options) => Promise.resolve(mw(freeze(Object.assign({}, options, {
    _input: options
}))));
export const createStack = (...fns) => {
    const [first, ...rest] = fns;
    return options => {
        if (rest.length === 0) {
            return promisifyMiddleware(first, options);
        }
        return rest.reduce((composed, current) => {
            return composed.then(current);
        }, promisifyMiddleware(first, options));
    };
};