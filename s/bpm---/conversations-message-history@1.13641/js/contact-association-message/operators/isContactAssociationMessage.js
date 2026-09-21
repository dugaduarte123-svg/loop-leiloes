'use es6';

import {
    getTopLevelType
} from '../../common-message-format/operators/commonMessageFormatGetters';
import {
    CONTACT_ASSOCIATION
} from '../constants/messageTypes';
export const isContactAssociationMessage = message => getTopLevelType(message) === CONTACT_ASSOCIATION;