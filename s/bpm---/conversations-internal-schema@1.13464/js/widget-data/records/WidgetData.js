'use es6';

import {
    Record
} from 'immutable';
import Message from '../../message/records/Message';
import ColoringRecord from '../../coloring/records/ColoringRecord';
import TypicalResponseTime from '../../typical-response-time/records/TypicalResponseTime';
import WidgetAvailabilityOptions from '../../availability/records/WidgetAvailabilityOptions';
import GDPRConsentOptions from './GDPRConsentOptions';
import {
    V1,
    RIGHT_ALIGNED
} from '../constants/widgetDataTypes';
import WidgetFont from '../../font/model/WidgetFont';
const TYPE = '@type';
export default Record({
    [TYPE]: V1,
    availabilityOptions: new WidgetAvailabilityOptions(),
    botResponder: null,
    channelInstanceId: null,
    chatflowId: null,
    coloring: ColoringRecord(),
    enableAttachments: true,
    enableScreencapture: false,
    enableSdkCloseButton: false,
    gates: null,
    gdprConsentOptions: GDPRConsentOptions(),
    inOfficeHours: false,
    isKnowledgeBaseV3: false,
    knowledgeBaseUrl: null,
    language: null,
    meetingsLinkText: null,
    meetingsLinkUrl: null,
    message: Message(),
    messagesPageUri: null,
    nextOfficeHoursStartTime: 0,
    notificationAudio: null,
    privateLoad: false,
    dynamicWelcomeMessages: null,
    recommendedQuestionsForAgent: null,
    routingRuleDefinitionAI: null,
    sendFrom: null,
    sessionId: null,
    shouldListenToGdprBannerConsent: true,
    showPreviousConversations: true,
    showingHsBranding: false,
    spamProtectionMetadata: null,
    systemChatflow: false,
    typicalResponseTime: TypicalResponseTime(),
    usingOfficeHours: false,
    widgetFont: WidgetFont(),
    widgetLocation: RIGHT_ALIGNED
}, 'WidgetData');