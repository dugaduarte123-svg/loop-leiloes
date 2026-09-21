import I18n from 'I18n';
export const relativeTimeSince = (locale, timestamp, format = 'short') => {
  const diff = (new Date(timestamp).valueOf() - new Date().valueOf()) * -1;
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;
  try {
    // eslint-disable-next-line compat/compat
    const rtf = new Intl.RelativeTimeFormat(locale, {
      style: format
    });
    if (diff < minute) {
      const seconds = Math.round(-diff / 1000);
      if (seconds === 0) {
        return I18n.text('conversations-visitor-ui.timeSince.secondsAgo');
      }
      return rtf.format(seconds, 'second');
    }
    if (diff < hour) {
      const minutes = Math.round(-diff / minute);
      return rtf.format(minutes, 'minute');
    }
    if (diff < day) {
      const hours = Math.round(-diff / hour);
      return rtf.format(hours, 'hour');
    }
    if (diff < month) {
      const days = Math.round(-diff / day);
      return rtf.format(days, 'day');
    }
    if (diff < year) {
      const months = Math.round(-diff / month);
      return rtf.format(months, 'month');
    }
    if (diff >= year) {
      const years = Math.round(-diff / year);
      return rtf.format(years, 'year');
    }
  } catch (e) {
    // ie does not support RelativeTimeFormat
    return new Date(timestamp).toLocaleDateString(locale);
  }
  return new Date(timestamp).toLocaleDateString(locale);
};