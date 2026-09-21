// @ts-ignore untyped file
import { publishVisitorMessage } from '../pubsub/actions/publishVisitorMessage';
import { trackInteraction } from '../usage-tracking/actions/trackInteraction';
import { toggleOpen } from './WidgetActions';
import { EVENT_NAMES } from '../usage-tracking/constants/eventNames';
import { THREAD_VIEW } from 'conversations-visitor-experience-components/visitor-widget/constants/views';
import { updateView } from '../current-view/actions/updateView';
export function selectQuickReplyOptionOutsideChat(text, quickReply) {
  return dispatch => {
    const selectedQuickReplyOption = {
      '@type': 'QUICK_REPLIES',
      quickReplies: [quickReply.toJS()],
      allowMultiSelect: false,
      allowUserInput: true
    };
    dispatch(publishVisitorMessage({
      text,
      quickReply: selectedQuickReplyOption
    })).then(() => {
      dispatch(toggleOpen({
        isOpened: true,
        isUser: true,
        openedFrom: 'quick reply outside chat'
      }));
      dispatch(updateView(THREAD_VIEW));
      dispatch(trackInteraction(EVENT_NAMES.WIDGET_INTERACTION, {
        action: 'clicked quick reply option outside chat'
      }));
    }).catch(() => {
      throw new Error('selectQuickReplyOptionOutsideChat failed');
    });
  };
}