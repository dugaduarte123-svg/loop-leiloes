'use es6';

import TitleTypes from '../constants/TitleTypes';
export default {
    ja: {
        [TitleTypes.COMPANY]: name => `${name} 御中`,
        [TitleTypes.CUSTOMER]: name => `${name} 様`
    }
};