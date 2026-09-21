'use es6';

import {
    Record
} from 'immutable';

/**
 * Given a record-building function, returns the name of the record. Since the name is not set on
 * the record until the record is first instantiated, this function also attempts to construct the
 * record and pull its name from there.
 *
 * @param {Function} record
 */
export const getRecordName = (record = {}) => {
    let prototypeToUse = null;
    if (record.prototype instanceof Record) {
        prototypeToUse = record.prototype;
    } else if (record.constructor && record.constructor.prototype instanceof Record) {
        prototypeToUse = record.constructor.prototype;
    }
    if (prototypeToUse) {
        if (prototypeToUse._name) {
            return prototypeToUse._name;
        }
        // eslint-disable-next-line no-new
        new record();
        return prototypeToUse._name || 'Record';
    }
    return 'Object';
};