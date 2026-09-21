import { fromJS, OrderedSet, Record, Map as ImmutableMap } from 'immutable';
import get from 'transmute/get';
import toJS from 'transmute/toJS';
import { QUICK_REPLIES } from '../constants/attachmentTypes';
class QuickReplyAttachment extends Record({
  '@type': QUICK_REPLIES,
  quickReplies: OrderedSet(),
  allowMultiSelect: false,
  allowUserInput: false
}, 'QuickReplyAttachment') {
  constructor(properties = ImmutableMap()) {
    const quickReplies = fromJS(get('quickReplies', properties));
    super(Object.assign({}, toJS(properties), {
      quickReplies: OrderedSet(quickReplies)
    }));
  }
}
export default QuickReplyAttachment;