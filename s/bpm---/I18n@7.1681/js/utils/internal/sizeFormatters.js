/* hs-eslint ignored failing-rules */
/* eslint-disable one-var */
/* eslint-disable no-var */
/* eslint-disable prefer-template */

'use es6';

import {
    translate
} from './text';
import {
    prepareOptions
} from './translateHelpers';
import {
    toNumber
} from './numberFormatters';

// Set default size units.
const SIZE_UNITS = [null, 'kb', 'mb', 'gb', 'tb'];

// Convert a number into a readable size representation.
export const toHumanSize = function toHumanSize(number, options) {
    var kb = 1024,
        size = number,
        iterations = 0,
        unit,
        precision;
    while (size >= kb && iterations < 4) {
        size = size / kb;
        iterations += 1;
    }
    if (iterations === 0) {
        unit = translate('number.human.storage_units.units.byte', {
            count: size
        });
        precision = 0;
    } else {
        unit = translate('number.human.storage_units.units.' + SIZE_UNITS[iterations]);
        precision = size - Math.floor(size) === 0 ? 0 : 1;
    }
    options = prepareOptions(options, {
        unit,
        precision,
        format: '%n%u',
        delimiter: ''
    });
    return toNumber(size, options);
};