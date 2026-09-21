'use es6';

import {
    List as ImmutableList
} from 'immutable';
import {
    hasUserAndTeamResponders
} from 'conversations-internal-schema/chat-heading-config/operators/hasUserAndTeamResponders';
const MAX_POTENTIAL_RESPONDERS = 3;
export function chatHeadingRespondersList({
    assignedResponder = null,
    chatHeadingConfig,
    responders,
    sendFromResponders = responders
}) {
    const respondersToPass = assignedResponder ? ImmutableList([assignedResponder]) : sendFromResponders;
    const chatHeadingResponders = !respondersToPass.size && (hasUserAndTeamResponders(chatHeadingConfig) || !chatHeadingConfig) ? responders : respondersToPass;
    return chatHeadingResponders.take(MAX_POTENTIAL_RESPONDERS);
}