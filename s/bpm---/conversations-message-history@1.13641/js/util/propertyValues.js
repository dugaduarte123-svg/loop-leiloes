'use es6';

import curry from 'transmute/curry';
import {
    Map as ImmutableMap,
    fromJS
} from 'immutable';
export const setDefaultValues = curry((defaults, subject) => ImmutableMap(defaults).merge(subject));
export const enforceValues = curry((valuesToEnforce, subject) => ImmutableMap(subject).merge(valuesToEnforce));
export const enforcePartialValues = curry((valuesToEnforce, subject) => fromJS(subject).mergeDeep(valuesToEnforce));