'use es6';

import {
    Record
} from 'immutable';
import {
    MESSAGE_TYPE_ID,
    CRM_OBJECT_WORKFLOW_EMAIL_SENT
} from '../constants/messageTypes';
const CrmObjectWorkflowEmailSent = Record({
    [MESSAGE_TYPE_ID]: CRM_OBJECT_WORKFLOW_EMAIL_SENT,
    emailMessageId: null,
    emailSubject: null,
    id: null,
    messageDeletedStatus: null,
    objectId: null,
    objectType: null,
    timestamp: null,
    workflowId: null,
    recipientVid: null
}, 'CrmObjectWorkflowEmailSent');
export default CrmObjectWorkflowEmailSent;