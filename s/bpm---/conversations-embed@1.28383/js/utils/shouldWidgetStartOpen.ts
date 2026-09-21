import { cookieIsSet } from '../cookies/cookieIsSet';
import { getCookie } from '../cookies/operators';
import { shouldEmbedInline } from '../external-api/settingsHelpers';
import { cookies } from '../cookies/constants';
import { urlHasHsChatHashLink } from './urlHasHsChatHashLink';
import { stringToBoolean } from './stringToBoolean';

/**
 * Specifies whether or not the widget must immediately start in an open or closed state, based
 * on conditions on the page.
 * If this function returns `true`, it must immediately start open.
 * If this function returns `false`, it must immediately start closed.
 * If this function returns `undefined`, then the embed script does not enforce any
 * particular open/closed state. It defers to the visitor UI to open or close the widget
 * based on the chatflow settings.
 * @return {?boolean} - whether or not the widget must start open
 */
export function shouldWidgetStartOpen() {
  const inline = shouldEmbedInline();
  if (!inline && cookieIsSet(cookies.IS_OPEN)) {
    const isOpenCookie = getCookie(cookies.IS_OPEN);
    return stringToBoolean(isOpenCookie);
  }
  return inline || urlHasHsChatHashLink(window.location.href) || undefined;
}