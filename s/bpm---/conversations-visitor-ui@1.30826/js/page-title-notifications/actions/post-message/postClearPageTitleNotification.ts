import { CLEAR_PAGE_TITLE_NOTIFICATION } from '../../../constants/PostMessageTypes';
import { postMessageToParent } from '../../../post-message/postMessageToParent';
export const postClearPageTitleNotification = () => {
  postMessageToParent(CLEAR_PAGE_TITLE_NOTIFICATION);
};