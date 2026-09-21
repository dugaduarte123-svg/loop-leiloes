import { createSelector } from '@reduxjs/toolkit';
import { getOfficeHoursStartTime } from 'conversations-internal-schema/availability/operators/availabilityGetters';
import { formatOfficeHoursWillReturnTimestamp } from 'conversations-visitor-experience-components/visitor-widget/util/formatOfficeHoursWillReturnTimestamp';
import { getWidgetAvailabilityOptions } from './getWidgetAvailabilityOptions';
import { getWidgetDataLanguage } from '../../widget-data/selectors/widgetDataSelectors';
export const getAvailabilityOfficeHoursWillReturnMessage = createSelector([getWidgetAvailabilityOptions, getWidgetDataLanguage], (availabilityOptions, locale) => {
  const officeHoursStartTime = getOfficeHoursStartTime(availabilityOptions);
  if (!officeHoursStartTime) {
    return '';
  }
  return formatOfficeHoursWillReturnTimestamp(officeHoursStartTime, locale);
});