'use es6';

function isStringFormat(quickReplyOption) {
    return typeof quickReplyOption === 'string';
}
export function getOptionLabel(quickReplyOption) {
    if (isStringFormat(quickReplyOption)) {
        return quickReplyOption;
    }
    if (!quickReplyOption.has('label')) {
        return quickReplyOption.get('value');
    }
    return quickReplyOption.get('label');
}
export function getOptionValue(quickReplyOption) {
    return isStringFormat(quickReplyOption) ? quickReplyOption : quickReplyOption.get('value');
}