import { createSelector } from '@reduxjs/toolkit';
import get from 'transmute/get';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
export const getChannelInstanceId = createSelector([getLatestWidgetData], get('channelInstanceId'));