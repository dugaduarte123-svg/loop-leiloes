'use es6';

import {
    fromJS,
    List
} from 'immutable';
import reduce from 'transmute/reduce';
import {
    EMAIL_METADATA,
    FILES,
    QUICK_REPLIES,
    QUICK_LINKS,
    INLINE_IMAGES,
    CALL_METADATA,
    MESSAGE_POSITION_DESCRIPTOR,
    LOCATION,
    CONTACT,
    UNSUPPORTED_CONTENT,
    MESSAGE_HEADER,
    CITATION,
    MESSAGE_FEEDBACK_REQUEST,
    INTERACTIVE_CARD
} from '../constants/attachmentTypes';
import EmailMetadata from '../records/EmailMetadata';
import FileAttachment from '../records/FileAttachment';
import QuickReplyAttachment from '../records/QuickReplyAttachment';
import InlineImageStatusAttachments from '../records/InlineImageStatusAttachments';
import CallMetadata from '../records/CallMetadata';
import LocationMetadata from '../records/LocationMetadata';
import ContactMetadata from '../records/ContactMetadata';
import MessagePositionDescriptor from '../records/MessagePositionDescriptor';
import UnsupportedContent from '../records/UnsupportedContent';
import MessageHeaderAttachment from '../records/MessageHeaderAttachment';
import MessageFeedbackRequestAttachment from '../records/MessageFeedbackRequestAttachment';
import InteractiveCardAttachment from '../records/InteractiveCardAttachment';
export const buildAttachments = (attachments, acceptedTypes) => {
    return reduce(List(), (attachmentList, attachment) => {
        const attachmentType = !acceptedTypes || acceptedTypes[attachment['@type']] ? attachment['@type'] : null;
        switch (attachmentType) {
            case EMAIL_METADATA:
                return attachmentList.push(EmailMetadata(fromJS(attachment)));
            case CITATION:
                return attachmentList.push(fromJS(attachment));
            case FILES:
                return attachmentList.push(FileAttachment(fromJS(attachment)));
            case QUICK_REPLIES:
                return attachmentList.push(new QuickReplyAttachment(attachment));
            case QUICK_LINKS:
                return attachmentList.push(fromJS(attachment));
            case INLINE_IMAGES:
                return attachmentList.push(InlineImageStatusAttachments(fromJS(attachment)));
            case CALL_METADATA:
                return attachmentList.push(new CallMetadata(attachment));
            case LOCATION:
                return attachmentList.push(new LocationMetadata(attachment));
            case CONTACT:
                return attachmentList.push(new ContactMetadata(attachment));
            case MESSAGE_POSITION_DESCRIPTOR:
                return attachmentList.push(MessagePositionDescriptor(fromJS(attachment)));
            case UNSUPPORTED_CONTENT:
                return attachmentList.push(new UnsupportedContent(attachment));
            case MESSAGE_HEADER:
                return attachmentList.push(new MessageHeaderAttachment(attachment));
            case MESSAGE_FEEDBACK_REQUEST:
                return attachmentList.push(new MessageFeedbackRequestAttachment(attachment));
            case INTERACTIVE_CARD:
                return attachmentList.push(new InteractiveCardAttachment(attachment));
            default:
                return attachmentList;
        }
    }, attachments || List());
};