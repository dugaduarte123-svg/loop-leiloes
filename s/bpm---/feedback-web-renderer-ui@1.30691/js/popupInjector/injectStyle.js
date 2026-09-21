'use es6';

const head = document.head || document.getElementsByTagName('head')[0];
const createStyle = text => {
    const styleTag = document.createElement('style');
    styleTag.type = 'text/css';
    if (styleTag.styleSheet) {
        styleTag.styleSheet.cssText = text;
    } else {
        styleTag.appendChild(document.createTextNode(text));
    }
    return styleTag;
};
const injectStyle = text => {
    head.appendChild(createStyle(text));
};
export default injectStyle;