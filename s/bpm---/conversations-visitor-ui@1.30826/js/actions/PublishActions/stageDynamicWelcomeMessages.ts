import { fromJS } from 'immutable';
import QuickReplyAttachment from 'conversations-message-history/common-message-format/records/QuickReplyAttachment';
import { QUICK_REPLIES } from 'conversations-message-history/common-message-format/constants/attachmentTypes';
import { getChannelInstanceId } from '../../selectors/widgetDataSelectors/getChannelInstanceId';
import { stageMessageOnStubbedThread } from '../../stubbed-thread-history/actions/stageMessageOnStubbedThread';
import { getDynamicWelcomeMessages } from '../../ai/dynamic-welcome-messages/dynamicWelcomeMessagesSelectors';
import { buildBotInitialMessage } from './buildBotInitialMessage';
const isQuickRepliesAttachment = attachment => attachment['@type'] === QUICK_REPLIES;
export function stageDynamicWelcomeMessages() {
  return (dispatch, getState) => {
    const state = getState();
    const dynamicWelcomeMessages = getDynamicWelcomeMessages(state);
    dynamicWelcomeMessages.forEach(({
      message
    }) => {
      var _message$richText;
      const attachments = [];
      const qrAttachment = message.attachments.find(isQuickRepliesAttachment);
      if (qrAttachment) {
        attachments.push(new QuickReplyAttachment(fromJS(qrAttachment)));
      }
      dispatch(stageMessageOnStubbedThread(buildBotInitialMessage({
        text: message.text,
        richText: (_message$richText = message.richText) !== null && _message$richText !== void 0 ? _message$richText : message.text,
        attachments,
        channelInstanceId: getChannelInstanceId(getState())
      })));
    });
  };
}