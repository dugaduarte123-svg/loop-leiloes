import { postExternalApiEvent } from '../../external-api-events/postExternalApiEvent';
import { QUICK_REPLY_BUTTON_CLICK } from '../../external-api-events/constants/externalApiEventTypes';
import { QUICK_REPLIES } from 'conversations-message-history/common-message-format/constants/attachmentTypes';
import get from 'transmute/get';
export const postEvent = ({
  name,
  multiSelect,
  value
}) => {
  postExternalApiEvent({
    eventType: QUICK_REPLY_BUTTON_CLICK,
    payload: {
      name,
      multiSelect,
      value
    }
  });
};
export const postQuickReplyButtonClickEvent = quickReply => {
  const quickReplies = get('quickReplies', quickReply);
  const allowMultiSelect = get('allowMultiSelect', quickReply);
  const payload = {
    name: QUICK_REPLIES,
    multiSelect: allowMultiSelect,
    value: Array.isArray(quickReplies) && quickReplies.length ? quickReplies.map(item => item.value) : []
  };
  postEvent(payload);
};