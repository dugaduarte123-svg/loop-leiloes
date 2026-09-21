import { createSelector } from '@reduxjs/toolkit';

// @ts-ignore Untyped Dependency
import { getCaptureVisitorEmailAddress } from 'conversations-internal-schema/message/operators/messageGetters';
import { getWelcomeMessage } from './getWelcomeMessage';
export const shouldCaptureVisitorEmailAddress = createSelector(getWelcomeMessage, getCaptureVisitorEmailAddress);