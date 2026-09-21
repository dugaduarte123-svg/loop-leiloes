'use es6';

import aggregator from './aggregator';
export default ((target, eventName, opts = {}) => aggregator(fn => {
    target.addEventListener(eventName, fn, opts);
    return () => {
        target.removeEventListener(eventName, fn, opts);
    };
}));