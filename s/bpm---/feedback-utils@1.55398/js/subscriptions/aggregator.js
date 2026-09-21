'use es6';

export default (subscribeRoot => {
    let teardown = true;
    let subscribers = [];
    const rootSubscriber = (...args) => {
        subscribers.forEach(subscriber => {
            subscriber(...args);
        });
    };
    return subscriber => {
        if (teardown && subscribers.length === 0) {
            teardown = subscribeRoot(rootSubscriber);
        }
        subscribers.push(subscriber);
        const unsubscribe = () => {
            const startLen = subscribers.length;
            subscribers = subscribers.filter(fn => fn !== subscriber);
            if (teardown && subscribers.length === 0 && startLen > 0) {
                teardown();
            }
        };
        return unsubscribe;
    };
});