'use es6';

import _objectDestructuringEmpty from "@babel/runtime/helpers/esm/objectDestructuringEmpty";
import pipe from 'transmute/pipe';
import get from 'transmute/get';
import PortalIdParser from 'PortalIdParser';
import ConversationStatusTypes from 'conversations-internal-schema/constants/ConversationStatusTypes';
import Thread from '../records/Thread';
import {
    setDefaultValues,
    enforceValues
} from 'conversations-message-history/util/propertyValues';
import ChannelDetails from '../../channel-details/records/ChannelDetails';

/**
 * Build a Thread record from an JavaScript or Immutable object.
 *
 * @param {Object|Map|Thread} [props={}] - Properties to build the conversation from
 * @return {Thread}
 *
 */

export function buildThread(_ref = {}) {
    let props = Object.assign({}, (_objectDestructuringEmpty(_ref), _ref));
    return pipe(setDefaultValues({
        portalId: PortalIdParser.get(),
        status: ConversationStatusTypes.STARTED
    }), enforceValues({
        unseenCount: get('unseenCount', props) || 0,
        channelDetails: ChannelDetails(get('channelDetails', props))
    }), Thread)(props);
}