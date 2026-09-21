import I18n from 'I18n';
import { timestampIsToday } from './timestampIsToday';
import { timestampIsTomorrow } from './timestampIsTomorrow';
export const formatOfficeHoursWillReturnTimestamp = (timestamp, locale) => {
  const time = new Date(timestamp);
  // format: 8:00 AM
  const formattedTime = time.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit'
  });
  if (timestampIsToday(timestamp)) {
    return I18n.text('conversations-visitor-experience-components.officeHours.sameDay', {
      time: formattedTime
    });
  }
  if (timestampIsTomorrow(timestamp)) {
    return I18n.text('conversations-visitor-experience-components.officeHours.nextDay', {
      time: formattedTime
    });
  }
  return I18n.text('conversations-visitor-experience-components.officeHours.nextWeek', {
    dayOfWeek: time.toLocaleDateString(locale, {
      weekday: 'long'
    }),
    time: formattedTime
  });
};