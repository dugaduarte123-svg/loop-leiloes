import I18n from 'I18n';
import { incrementUnseenCount } from '../../actions/ConversationsActions/incrementUnseenCount';
import { postShowPageTitleNotification } from '../../page-title-notifications/actions/post-message/postShowPageTitleNotification';
export const hasNewUnseenMessage = ({
  channel,
  threadId
}) => dispatch => {
  dispatch(incrementUnseenCount({
    channel,
    threadId
  }));
  postShowPageTitleNotification({
    title: I18n.text('conversations-visitor-ui.pageTitleNotifications.newMessage')
  });
};