'use es6';

import curry from 'transmute/curry';
import {
    getSenderType
} from './commonMessageFormatGetters';
import {
    AGENT,
    BOT,
    INTEGRATOR,
    SYSTEM,
    VISITOR
} from '../constants/legacySenderTypes';
export const isSenderType = curry((senderType, message) => getSenderType(message) === senderType);
export const isFromAgent = isSenderType(AGENT);
export const isFromBot = isSenderType(BOT);
export const isFromSystem = isSenderType(SYSTEM);
export const isFromVisitor = isSenderType(VISITOR);
export const isFromIntegrator = isSenderType(INTEGRATOR);