'use es6';

export const getOrigin = url => {
    if (!url || url === '') return null;
    const pathArray = url.split('/');
    const protocol = pathArray[0];
    const host = pathArray[2];
    return `${protocol}//${host}`;
};
const param = (key, val) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
export const toQueryParams = obj => Object.keys(obj).reduce((acc, key) => {
    const val = obj[key];
    return [ /* eslint-disable-next-line hubspot-dev/no-reduce-accumulator-copy */
        ...acc, ...(Array.isArray(val) ? val.map(subVal => param(key, subVal)) : [param(key, val)])
    ];
}, []).join('&');