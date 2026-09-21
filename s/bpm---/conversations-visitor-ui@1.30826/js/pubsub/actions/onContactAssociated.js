'use es6';

import {
    postExternalApiEvent
} from '../../external-api-events/postExternalApiEvent';
import {
    CONTACT_ASSOCIATED
} from '../../external-api-events/constants/externalApiEventTypes';
export const onContactAssociated = () => {
    postExternalApiEvent({
        eventType: CONTACT_ASSOCIATED,
        payload: {
            message: 'Contact has been associated'
        }
    });
};