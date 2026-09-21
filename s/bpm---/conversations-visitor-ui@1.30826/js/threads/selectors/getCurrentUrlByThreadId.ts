import { createSelector } from '@reduxjs/toolkit';
import { getThreadByThreadId } from './getThreadByThreadId';
import { getCurrentUrl } from '../operators/getCurrentUrl';
export const getCurrentUrlByThreadId = createSelector([getThreadByThreadId], getCurrentUrl);