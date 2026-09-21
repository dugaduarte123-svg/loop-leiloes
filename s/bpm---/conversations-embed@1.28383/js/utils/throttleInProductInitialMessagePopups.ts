import { setCookie } from '../cookies/operators';
import { cookies } from '../cookies/constants';
import Times from '../cookies/times';
import { isEmbeddedInProduct } from './isEmbeddedInProduct';
import { shouldHideWelcomeMessage } from './shouldHideWelcomeMessage';
export function throttleInProductInitialMessagePopups({
  portalId
}) {
  if (isEmbeddedInProduct({
    portalId
  }) && !shouldHideWelcomeMessage()) {
    setCookie(cookies.HIDE_WELCOME_MESSAGE, true, Times.ONE_DAY);
  }
}