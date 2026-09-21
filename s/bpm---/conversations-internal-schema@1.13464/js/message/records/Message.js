'use es6';

import {
    Record,
    List
} from 'immutable';
import {
    DEFAULT_MESSAGE_ID
} from '../constants/defaultMessageId';
import ClientTriggers from '../../client-triggers/records/ClientTriggers';
import {
    NEVER
} from '../../widget-data/constants/gdprCookieConsentTypes';
import {
    TRENDING
} from '../../knowledge-base/constants/constants';
import {
    DEFAULT
} from '../../widget-data/constants/launcherTypes';
export default Record({
    askForEmail: true,
    askForEmailMessage: null,
    captureVisitorEmailAddress: true,
    chatHeadingConfig: null,
    clientTriggers: new ClientTriggers(),
    customConsentToProcessCheckboxLabel: null,
    customConsentToProcessMessage: null,
    customConsentToCommunicateMessage: null,
    consentToCommunicateSubscriptionId: null,
    createdAt: null,
    creatorId: null,
    customEmailCaptureDelay: null,
    id: DEFAULT_MESSAGE_ID,
    inboxId: null,
    initialMessage: null,
    lastEditedAt: null,
    lastEditorId: null,
    name: null,
    popMessageOnSmallScreens: true,
    popOpenWelcomeMessage: true,
    popOpenWidget: false,
    portalId: null,
    gdprConsentToProcessEnabled: false,
    gdprConsentToCommunicateEnabled: false,
    cookieConsentPrompt: NEVER,
    cookieConsentPromptMessage: null,
    gdprExplicitConsentRequired: true,
    knowledgeBaseEnabled: false,
    knowledgeBaseRecommendationType: TRENDING,
    searchableKnowledgeBaseIds: List(),
    quickRepliesDisplay: 'NONE',
    launcherType: DEFAULT,
    spotlightConfig: null
}, 'Message');