'use es6';

const isTrue = v => v && v.toLowerCase() === 'true';
export const isSafeMode = options => options.safeMode || options.localStorage && isTrue(options.localStorage.getItem('HUB-HTTP_SAFE_MODE'));