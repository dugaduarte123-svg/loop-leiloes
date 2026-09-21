'use es6';

/* eslint-disable-next-line hubspot-dev/no-hublet-references */
const NA1 = 'na1';
export default function getHubletSuffix(hublet = '') {
    /* eslint-disable-next-line hubspot-dev/no-hublet-comparison */
    if (!hublet || hublet === NA1) {
        return '';
    }
    return `-${hublet}`;
}