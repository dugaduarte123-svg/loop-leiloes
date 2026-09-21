'use es6';

import aggregator from './aggregator';
export default ((interval, onRelease) => aggregator(fn => {
    const threadId = setInterval(fn, interval);
    return () => {
        if (onRelease) onRelease();
        clearInterval(threadId);
    };
}));