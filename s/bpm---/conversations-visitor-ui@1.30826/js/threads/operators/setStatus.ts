import curry from 'transmute/curry';
import { STATUS } from '../constants/KeyPaths';
export const setStatus = curry((status, thread) => thread.setIn(STATUS, status));