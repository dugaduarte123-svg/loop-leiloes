import I18n from 'I18n';
import getLang from 'I18n/utils/getLang';
import userInfo from 'hub-http/userInfo';
import { genericClient } from 'usage-tracker-core/client';
import { once } from 'usage-tracker-core/common/helpers';
export const getUserEmail = (shouldCache = true) => userInfo({
  ignoreRedirect: true,
  cached: shouldCache
}).then(({
  user
}) => user.email).catch(() => null);
export const getPortalId = (shouldCache = true) => userInfo({
  ignoreRedirect: true,
  cached: shouldCache
}).then(({
  portal
}) => portal.portal_id).catch(() => null);
export const getUserLanguage = () => Promise.resolve(I18n.Info).then(getLang).catch(genericClient.getLang);
export const onceUserEmail = once(getUserEmail);
export const oncePortalId = once(getPortalId);
export const onceUserLanguage = once(getUserLanguage);