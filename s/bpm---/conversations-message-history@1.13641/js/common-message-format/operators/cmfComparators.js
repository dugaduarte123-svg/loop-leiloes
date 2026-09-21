'use es6';

import get from 'transmute/get';
import {
    VISITOR_SENDER
} from '../constants/cmfSenderTypes';
import {
    COMMON_MESSAGE
} from '../constants/messageTypes';
import {
    getSenderTypeForCMF
} from './commonMessageFormatGetters';
import {
    FB_MESSENGER_GENERIC_CHANNEL_ID,
    FORMS_GENERIC_CHANNEL_ID,
    EMAIL_GENERIC_CHANNEL_ID,
    LIVE_CHAT_GENERIC_CHANNEL_ID
} from '../constants/genericChannelIds';
import {
    getGenericChannelId,
    getSenders
} from '../operators/commonMessageGetters';
export const isCommonMessageFormat = message => {
    return get('@type', message) === COMMON_MESSAGE;
};
export const isBotCMF = message => {
    if (isCommonMessageFormat(message)) {
        var _getSenders;
        return !!((_getSenders = getSenders(message)) !== null && _getSenders !== void 0 && _getSenders.find(sender => {
            var _sender$actorId, _sender$actorId2;
            //for each sender, check actorid. if actor id has B or L its a bot
            if ((_sender$actorId = sender.actorId) !== null && _sender$actorId !== void 0 && _sender$actorId.startsWith('B') || (_sender$actorId2 = sender.actorId) !== null && _sender$actorId2 !== void 0 && _sender$actorId2.startsWith('L')) return true;
            return false;
        }));
    }
    return false;
};
export const isFormCMF = message => {
    return isCommonMessageFormat(message) && getGenericChannelId(message) === FORMS_GENERIC_CHANNEL_ID;
};
export const isEmailCMF = message => {
    return isCommonMessageFormat(message) && getGenericChannelId(message) === EMAIL_GENERIC_CHANNEL_ID;
};
export const isChatMessage = message => {
    return isCommonMessageFormat(message) && !isEmailCMF(message);
};
export const isLiveChatPlainText = message => {
    return isCommonMessageFormat(message) && getSenderTypeForCMF(message) === VISITOR_SENDER && getGenericChannelId(message) === LIVE_CHAT_GENERIC_CHANNEL_ID;
};
export const isForwardableEmailOrFormCMF = message => {
    return isCommonMessageFormat(message) && (isEmailCMF(message) || isFormCMF(message));
};
export const isFacebookChannel = message => isCommonMessageFormat(message) && getGenericChannelId(message) === FB_MESSENGER_GENERIC_CHANNEL_ID;