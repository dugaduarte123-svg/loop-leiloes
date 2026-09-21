import { OFFLINE, ONLINE } from 'visitor-ui-component-library/indicator/constants/StatusIndicatorStatus';
import I18n from 'I18n';
export function getAvatarAltText(status, identifier) {
  const i18nOptions = {
    identifier
  };
  if (status === ONLINE) {
    return I18n.text('conversations-visitor-experience-components.default.avatarAvailable', i18nOptions);
  }
  if (status === OFFLINE) {
    return I18n.text('conversations-visitor-experience-components.default.avatarAway', i18nOptions);
  }
  return I18n.text('conversations-visitor-experience-components.default.avatar', i18nOptions);
}