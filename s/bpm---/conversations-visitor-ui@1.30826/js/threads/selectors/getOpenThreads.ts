import { createSelector } from '@reduxjs/toolkit';
import filter from 'transmute/filter';
import { isStarted } from '../operators/isStarted';
// @ts-ignore Untyped import
import { getThreadList } from './getThreadList';
export const getOpenThreads = createSelector([getThreadList],
// @ts-ignore Transmute types are not good
filter(isStarted));