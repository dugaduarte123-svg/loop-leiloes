'use es6';

import {
    connect
} from 'react-redux';
import {
    toggleOpen
} from '../actions/WidgetActions';
import {
    isSucceeded
} from '../constants/asyncStatuses';
import {
    handleReceiveWidgetData
} from '../widget-data/actions/handleReceiveWidgetData';
import {
    onGlobalCookieOptOut
} from '../visitor-identity/actions/updateGlobalCookieOptOut';
import {
    updateIsFirstVisitorSession
} from '../visitor-identity/actions/updateIsFirstVisitorSession';
import {
    updateVisitorIdentification
} from '../visitor-identity/reducers/visitorIdentificationSlice';
import {
    refreshWidgetData
} from '../widget-data/actions/refreshWidgetData';
import {
    setWindowVisible
} from '../actions/WindowActions';
import {
    fetchCurrentThreadHistory
} from '../thread-histories/actions/fetchCurrentThreadHistory';
import {
    handleScrollPercentageChange
} from '../scroll-percentage-trigger/actions/handleScrollPercentageChange';
import {
    setMessageEditorStagingText
} from '../actions/messageEditorActions';
import {
    getIsOpen
} from '../selectors/getIsOpen';
import {
    getIsMobile
} from '../selectors/getIsMobile';
import {
    getWidgetLocation
} from '../selectors/widgetDataSelectors/getWidgetLocation';
import {
    getWidgetDataAsyncData
} from '../widget-data/selectors/getWidgetDataAsyncData';
import {
    trackUserInteraction
} from '../actions/trackUserInteraction';
import Application from '../components/Application';
import {
    preloadThreadViewOrKnowledgeBase
} from '../actions/preloadThreadViewOrKnowledgeBase';
import {
    getShowInitialMessageBubble
} from '../initial-message-bubble/selectors/getShowInitialMessageBubble';
import {
    executeExitIntentTrigger
} from '../client-triggers/actions/executeExitIntentTrigger';
import {
    loadStagedThread
} from '../navigation/actions/loadStagedThread';
import {
    getSelectedThreadId
} from '../selected-thread/selectors/getSelectedThreadId';
import {
    STUBBED_THREAD_ID
} from '../threads/constants/stubbedThreadId';
import {
    ConsumeVisitorIdentityContext
} from '../visitorIdentityContext/VisitorIdentityContext';
import {
    trackInteraction
} from '../usage-tracking/actions/trackInteraction';
import {
    setKBArticle
} from '../kb-article/kbArticleSlice';
import {
    navigateToKBContent
} from '../navigation/actions/navigateToKBContent';
import {
    setSpeechPocActive,
    setAudioPlaybackStatus,
    setSpeechRecordingStatus
} from '../actions/speechPocActions';
import {
    getLauncherType,
    getIsUngatedForClosingAgentRefresh,
    getIsClosingAgentSystemChatflow
} from '../widget-data/selectors/widgetDataSelectors';
import {
    selectAttachmentFile
} from '../file-uploads/actions/selectAttachmentFile';
import {
    getSelectedThread
} from '../selected-thread/selectors/getSelectedThread';
import {
    setEntryUrlMetadata
} from '../thread-create/reducers/entryUrlMetadataSlice';
import {
    isSpeechPocPortal
} from '../utils/isSpeechPocPortal';
const mapStateToProps = state => {
    var _state$speechPoc, _state$speechPoc2;
    const widgetDataAsyncData = getWidgetDataAsyncData(state);
    const shouldRenderContent = isSucceeded(widgetDataAsyncData);
    const thread = getSelectedThread(state);
    const isViewingStubbedThread = getSelectedThreadId(state) === STUBBED_THREAD_ID;
    return {
        isOpen: getIsOpen(state),
        mobile: getIsMobile(state),
        shouldRenderContent,
        showInitialMessageBubble: getShowInitialMessageBubble(state),
        speechPocActive: isSpeechPocPortal() && ((_state$speechPoc = state.speechPoc) === null || _state$speechPoc === void 0 ? void 0 : _state$speechPoc.speechPocActive),
        audioPlaybackStatus: (_state$speechPoc2 = state.speechPoc) === null || _state$speechPoc2 === void 0 ? void 0 : _state$speechPoc2.audioPlaybackStatus,
        widgetLocation: getWidgetLocation(state),
        isViewingStubbedThread,
        thread,
        launcherType: getLauncherType(state),
        isUngatedForClosingAgentRefresh: getIsUngatedForClosingAgentRefresh(state),
        isClosingAgentSystemChatflow: getIsClosingAgentSystemChatflow(state)
    };
};
const mapDispatchToProps = {
    executeExitIntentTrigger,
    fetchCurrentThreadHistory,
    updateIsFirstVisitorSession,
    onGlobalCookieOptOut,
    handleReceiveWidgetData,
    handleScrollPercentageChange,
    onLauncherHover: preloadThreadViewOrKnowledgeBase,
    setWindowVisible,
    refreshWidgetData,
    setSpeechPocActive,
    setAudioPlaybackStatus,
    setSpeechRecordingStatus,
    toggleOpen,
    trackInteraction,
    trackUserInteraction,
    loadStagedThread,
    updateVisitorIdentification,
    setKBArticle,
    setMessageEditorStagingText,
    selectAttachmentFile,
    setEntryUrlMetadata,
    navigateToKBContent
};
export default ConsumeVisitorIdentityContext(connect(mapStateToProps, mapDispatchToProps)(Application));