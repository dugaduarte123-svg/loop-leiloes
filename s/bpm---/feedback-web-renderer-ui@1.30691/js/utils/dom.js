'use es6';

export const setAttrs = (node, attributes) => {
    Object.keys(attributes).forEach(key => {
        node.setAttribute(key, attributes[key]);
    });
    return node;
};
export const createNode = (name, attributes = {}) => setAttrs(document.createElement(name), attributes);
export const insertNode = (parent, node) => {
    const firstChild = (parent.childNodes || {})[0];
    if (firstChild) {
        parent.insertBefore(node, firstChild);
        return parent;
    }
    parent.appendChild(node);
    return parent;
};
const cleanClassName = str => str.replace(/(^ *| *$)/g, '').replace(/ +/g, ' ');
export const addClass = (node, className) => {
    node.className = cleanClassName(`${node.className} ${className}`);
};
export const removeClass = (node, className) => {
    node.className = cleanClassName(node.className.replace(new RegExp(className, 'g'), ''));
};