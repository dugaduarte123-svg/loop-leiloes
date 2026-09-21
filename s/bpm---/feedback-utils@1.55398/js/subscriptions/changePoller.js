'use es6';

import intervalAggregator from './interval';
const eq = (a, b) => a === b;
export default ((getter, comparator = eq, interval = 1000) => {
    let val;
    let first = true;
    const subscribe = intervalAggregator(interval, () => {
        first = true;
    });
    return fn => subscribe(() => {
        const newVal = getter();
        if (!comparator(newVal, val)) {
            if (!first) fn(newVal);
            val = newVal;
        }
        first = false;
    });
});