'use es6';

import Env from 'enviro';
const isFunction = options => typeof options === 'function';

// IE11 symbols are just normal properties and don't need this to get picked up
const getOwnPropertySymbols = Object.getOwnPropertySymbols || (() => []);
export default (options => {
    if (Env.deployed('hub-http') || !Object.freeze) return options;
    Object.freeze(options);
    Object.getOwnPropertyNames(options).concat(getOwnPropertySymbols(options)).forEach(name => {
        if (isFunction(options) && name !== 'caller' && name !== 'callee' && options[name] != null && !Object.isFrozen(options[name])) {
            Object.freeze(options[name]);
        }
    });
    return options;
});