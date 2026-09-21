import { List } from 'immutable';
import curry from 'transmute/curry';
import get from 'transmute/get';
import pipe from 'transmute/pipe';
import { HS_EMAIL_ADDRESS } from '../constants/deliveryIdentifierTypes';
// @ts-ignore module not typed
import getSenderActorType from './getSenderActorType';
import { getDeliveryIdentifier, getActorId, getActorType, getSenderName } from './senderGetters';
import { LLM_ACTOR } from '../constants/actorTypes';
import { EMAIL, SYSTEM, AGENT, VISITOR } from '../constants/legacySenderTypes';
import { FILES, EMAIL_METADATA } from '../constants/attachmentTypes';
import { isInteractiveCardAttachment } from './isInteractiveCardAttachment';
import { getRecipientField as getRecipientFieldFromRecipient, getSingleDeliveryIdentifier, getActorId as getRecipientActorId } from './recipientGetters';
import { getDeliveryIdentifierValue, getDeliveryIdentifierType } from './deliveryIdentifierGetters';
/**
 * The modern home of common message operators as we
 * look to get off of ./commonMessageFormatGetters, which
 * has a lot of edge-casing and checks introduced during
 * record migrations.
 */
export const getId = get('id');
export const getHiddenBy = get('hiddenBy');
export const getChannelInstanceId = get('channelInstanceId');
export const getGenericChannelId = get('genericChannelId');
export const getIntegrationId = get('integrationId');
export const getRecipients = get('recipients');
export const getSenders = get('senders');
export const getRecipientField = getRecipientFieldFromRecipient;
export const getSenderField = get('senderField');
export const getMessageDirection = get('direction');
/**
 * @deprecated use 'conversations-message-history/common-message-format/operators/senderGetters and conversations-message-history/common-message-format/operators/deliveryIdentifierGetters instead'
 */
export const getSenderDeliveryIdentifierType = sender => {
  const deliveryIdentifier = getDeliveryIdentifier(sender);
  return deliveryIdentifier ? deliveryIdentifier.type : undefined;
};
/**
 * @deprecated use 'conversations-message-history/common-message-format/operators/senderGetters and conversations-message-history/common-message-format/operators/deliveryIdentifierGetters instead'
 */
export const getSenderDeliveryIdentifierValue = sender => {
  const deliveryIdentifier = getDeliveryIdentifier(sender);
  return deliveryIdentifier ? deliveryIdentifier.value : undefined;
};
export const getRecipientDeliveryIdentifierValue = (recipient, deliveryIdentifierType) => {
  const deliveryIdentifier = getSingleDeliveryIdentifier(recipient);
  return getDeliveryIdentifierType(deliveryIdentifier) === deliveryIdentifierType ? getDeliveryIdentifierValue(deliveryIdentifier) : null;
};
export const getDeliveryIdentifiers = (recipients, deliveryIdentifierType) => {
  return recipients.reduce((acc, recipient) => {
    const deliveryIdentifier = getSingleDeliveryIdentifier(recipient);
    if (getDeliveryIdentifierType(deliveryIdentifier) === deliveryIdentifierType) {
      return acc.push(getDeliveryIdentifierValue(deliveryIdentifier));
    }
    return acc;
  }, List());
};
export const getEmailRecipientDeliveryIdentifierValue = recipient => getRecipientDeliveryIdentifierValue(recipient, HS_EMAIL_ADDRESS);
export const getFilteredRecipientsByField = (commonMessage, fieldType) => {
  const recipients = getRecipients(commonMessage);
  if (!recipients) {
    return List();
  }
  return List(recipients.filter(recipient => getRecipientField(recipient) === fieldType));
};
export const getFilteredSendersByField = (commonMessage, fieldType) => {
  const senders = getSenders(commonMessage);
  return senders && senders.filter(sender => getSenderField(sender) === fieldType) || List();
};
const getRecipientsForField = curry((fieldType, deliveryIdentifierType, message) => {
  const recipients = getFilteredRecipientsByField(message, fieldType);
  return getDeliveryIdentifiers(recipients, deliveryIdentifierType);
});
export const getSendersForField = curry((fieldType, deliveryIdentifierType, message) => {
  const senders = getFilteredSendersByField(message, fieldType);
  if (senders.size) {
    const firstSender = senders.first();
    const senderDeliveryIdentifierType = getSenderDeliveryIdentifierType(firstSender);
    const isDeliveryIdentifierType = senderDeliveryIdentifierType && senderDeliveryIdentifierType === deliveryIdentifierType;
    if (isDeliveryIdentifierType) {
      const deliveryIdentifierValue = getSenderDeliveryIdentifierValue(firstSender);
      return deliveryIdentifierValue || '';
    }
  }
  return '';
});
export const getActorInfo = sender => {
  const actorId = getActorId(sender) || '';
  const actorInfo = actorId.split('-');
  if (actorInfo.length >= 2) {
    const [prefix, ...rest] = actorInfo;
    return [prefix, rest.join('-')];
  }
  return [null, null];
};
export const getSenderType = sender => {
  const [actorType] = getActorInfo(sender);
  return getSenderActorType(actorType);
};
export const getSenderId = sender => {
  const [, actorId] = getActorInfo(sender);
  if (actorId) {
    const parsed = parseInt(actorId, 10); // can actorId be safely typed as number?
    return !isNaN(parsed) ? parsed : actorId;
  }
  return actorId;
};
// temporary work around to satisfy consumers of getSenderIdFromMessage
export const getSenderIdFromMessage = message => {
  const senders = getSenders(message) || List();
  const foundSender = senders.find(sender => {
    // ignoring EMAIL because when provided FROM and ORIGINAL_FROM we want to get sender which has
    // vid in its actorId. Ignoring SYSTEM to follow old selector pattern
    const senderType = getSenderType(sender);
    return senderType !== EMAIL && senderType !== SYSTEM;
  });
  return getSenderId(foundSender);
};
export const getSenderTypeFromMessage = message => {
  const senders = getSenders(message) || List();
  const foundSender = senders.find(sender => {
    // Ignoring EMAIL for now because it is a new type of actor and does not break existing code
    return getSenderType(sender) !== EMAIL;
  });
  return foundSender && getSenderType(foundSender) || null;
};
const hasSenderWithActorType = (message, actorType) => {
  const senders = getSenders(message) || List();
  return senders.some(sender => getActorType(sender) === actorType);
};
export const hasLlmSender = message => hasSenderWithActorType(message, LLM_ACTOR);
export const getTORecipients = getRecipientsForField('TO', HS_EMAIL_ADDRESS);
export const getCCRecipients = getRecipientsForField('CC', HS_EMAIL_ADDRESS);
export const getBCCRecipients = getRecipientsForField('BCC', HS_EMAIL_ADDRESS);
export const getTORecipientRecords = message => getFilteredRecipientsByField(message, 'TO');
export const getCCRecipientRecords = message => getFilteredRecipientsByField(message, 'CC');
export const getBCCRecipientRecords = message => getFilteredRecipientsByField(message, 'BCC');

// Returns the value of first delivery identifier for all recipients
// (e.g. emailAddresses of all recipients)
export const getAllRecipientsDeliveryIdentifiers = pipe(getRecipients, recipients => {
  if (!recipients) {
    return List();
  }
  return recipients.reduce((accumulator, recipient) => {
    const singleDeliveryIdentifier = getSingleDeliveryIdentifier(recipient);
    const deliveryIdentifierValue = singleDeliveryIdentifier.value;
    return deliveryIdentifierValue && !Number.isInteger(deliveryIdentifierValue) ? accumulator.push(deliveryIdentifierValue) : accumulator;
  }, List());
});
function getTypeFromRecipientActorId(fullActorId) {
  if (!fullActorId) {
    return {
      actorId: null,
      actorType: null
    };
  }
  const matches = fullActorId.match(/^[A|V]-(\d+)?/);
  let actorId = matches && matches[1];
  const actorTypeInitial = fullActorId.charAt(0);
  let actorType;
  switch (actorTypeInitial) {
    case 'A':
      actorType = AGENT;
      break;
    case 'V':
      actorType = VISITOR;
      break;
    default:
      actorId = null;
      actorType = null;
      break;
  }
  return {
    actorId,
    actorType
  };
}
export const convertRecipientToType = recipient => {
  return getTypeFromRecipientActorId(getRecipientActorId(recipient));
};
export function convertRecipientToTypePlainJS(recipient) {
  return getTypeFromRecipientActorId((recipient === null || recipient === void 0 ? void 0 : recipient.actorId) || null);
}
export const getSingleRecipientIdFromMessage = message => {
  const recipients = getRecipients(message) || List();
  const firstRecipient = recipients.get(0);
  const {
    actorId
  } = convertRecipientToType(firstRecipient);
  return firstRecipient && actorId || null;
};
export const getSingleRecipientTypeFromMessage = message => {
  const recipients = getRecipients(message) || List();
  const firstRecipient = recipients.get(0);
  const {
    actorType
  } = convertRecipientToType(firstRecipient);
  return firstRecipient && actorType || null;
};
export const getFromSenderEmail = getSendersForField('FROM', HS_EMAIL_ADDRESS);
export const getOriginalFromSenderEmail = getSendersForField('ORIGINAL_FROM', HS_EMAIL_ADDRESS);
export const getReplyToSenderEmail = getSendersForField('REPLY_TO', HS_EMAIL_ADDRESS);
export const getFromSenderName = message => {
  const senders = getSenders(message);
  return senders && senders.size > 0 && getSenderName(senders.first());
};

/* Attachments */
export const getAttachments = get('attachments');
export const getAttachmentWithType = curry((attachmentType, commonMessage) => {
  const attachments = getAttachments(commonMessage);
  if (attachments) {
    return attachments.find(attachmentObject => Boolean(attachmentObject && get('@type', attachmentObject) === attachmentType));
  }
  return undefined;
});
export const getMessageHeaderAttachmentWithType = curry((attachmentType, commonMessage) => {
  const attachments = getAttachments(commonMessage);
  if (attachments) {
    return attachments.find(attachmentObject => Boolean(attachmentObject && get('@type', attachmentObject) === attachmentType));
  }
  return undefined;
});

// Shorthand for known attachments
export const getEmailMetadataAttachment = getAttachmentWithType(EMAIL_METADATA);
export const getFileAttachments = getAttachmentWithType(FILES);
export const getGenericChannelIdForMessage = message => {
  return getGenericChannelId(message);
};
export const getInteractiveCardAttachment = message => {
  var _getAttachments;
  return (_getAttachments = getAttachments(message)) === null || _getAttachments === void 0 ? void 0 : _getAttachments.toArray().find(isInteractiveCardAttachment);
};
export const getSensitivityType = get('sensitivityType');
export const isMessageSensitive = message => {
  const sensitivityType = getSensitivityType(message);
  return sensitivityType !== undefined && sensitivityType !== 'NOT_SENSITIVE';
};