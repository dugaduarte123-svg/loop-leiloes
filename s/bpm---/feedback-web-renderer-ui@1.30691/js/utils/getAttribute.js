'use es6';

const getAttribute = attribute => {
    const node = document.querySelector(`script[${attribute}]`);
    if (node) {
        return node.getAttribute(attribute);
    }
    return null;
};
export default getAttribute;