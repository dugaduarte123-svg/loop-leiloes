import { SHOW_PAGE_TITLE_NOTIFICATION } from '../../../constants/PostMessageTypes';
import { postMessageToParent } from '../../../post-message/postMessageToParent';
export const postShowPageTitleNotification = payload => {
  postMessageToParent(SHOW_PAGE_TITLE_NOTIFICATION, payload);
};