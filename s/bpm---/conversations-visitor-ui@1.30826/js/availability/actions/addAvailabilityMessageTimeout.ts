import { createAction } from '@reduxjs/toolkit';
import { ADD_AVAILABILITY_MESSAGE_TIMEOUT } from '../constants/actionTypes';
const addAvailabilityMessageTimeout = createAction(ADD_AVAILABILITY_MESSAGE_TIMEOUT, (channel, timeout) => ({
  payload: {
    channel,
    timeout
  }
}));
export { addAvailabilityMessageTimeout as default, addAvailabilityMessageTimeout };