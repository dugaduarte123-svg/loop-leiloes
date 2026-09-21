'use es6';

import freeze from './freeze';

// Typeof helper required since removed from default babel transforms in https://github.com/HubSpotEngineering/bend-hubspot/pull/2390
// via https://github.com/babel/babel/blob/afb0f489debfaffc51dff5b61ab9dd5ffc91be64/packages/babel-helpers/src/helpers.js#L14-L28
/* eslint-disable no-func-assign */
function _typeof(obj) {
    '@babel/helpers - typeof';

    if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
        _typeof = function(objA) {
            return typeof objA;
        };
    } else {
        _typeof = function(objA) {
            return objA && typeof Symbol === 'function' && objA.constructor === Symbol && objA !== Symbol.prototype ? 'symbol' : typeof objA;
        };
    }
    return _typeof(obj);
}
/* eslint-enable no-func-assign */

export const set = (name, value) => obj => {
    obj = Object.assign({}, obj);
    obj[name] = value;
    return obj;
};
export const push = (name, value) => obj => set(name, [...(obj[name] || []), value])(obj);
const defaultForPath = path => typeof path[0] === 'string' || path[0] instanceof String || _typeof(path[0]) === 'symbol' ? freeze({}) : freeze([]);
export const setIn = (path, value) => (obj = defaultForPath(path)) => path.length === 1 ? set(path[0], value)(obj) : set(path[0], setIn(path.slice(1), value)(obj[path[0]]))(obj);
const resolvePredicate = (predicate, options) => typeof predicate === 'function' ? predicate(options) : predicate;
const getValue = v => typeof v === 'function' ? v() : v;
export const setIf = (predicate, propertyName, valueOrFn) => obj => resolvePredicate(predicate, obj) ? set(propertyName, getValue(valueOrFn))(obj) : obj;