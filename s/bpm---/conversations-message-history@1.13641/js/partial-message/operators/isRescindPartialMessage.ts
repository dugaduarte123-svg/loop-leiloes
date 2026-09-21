import { getPartialMessageType } from './partialMessageGetters';
import { RESCIND } from '../constants/partialMessageTypes';
export const isRescindPartialMessage = message => getPartialMessageType(message) === RESCIND;