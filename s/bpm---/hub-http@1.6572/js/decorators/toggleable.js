'use es6';

function toggleable(fn) {
    let enabled = true;
    const isEnabled = () => enabled;
    const setEnabled = state => {
        enabled = state;
    };
    const toggleableFn = (...args) => fn(isEnabled)(...args);
    return Object.assign(toggleableFn, {
        setEnabled
    });
}
export default toggleable;