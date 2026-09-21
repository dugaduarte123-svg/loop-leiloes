'use es6';

import {
    connect
} from 'react-redux';
import VisitorWidget from 'conversations-visitor-experience-components/visitor-widget/components/VisitorWidget';
import SpotlightThreadHistoryMenuContainer from './SpotlightThreadHistoryMenuContainer';
import {
    handleLightboxStateChange
} from '../../post-message/handleLightboxStateChange';
import {
    republishMessage
} from '../../actions/PublishActions/republishMessage';
import {
    getChatHeadingConfig
} from '../../chat-heading-config/selectors/getChatHeadingConfig';
import {
    showAvailabilityMessageInWidget
} from '../../availability/selectors/showAvailabilityMessageInWidget';
import {
    getAvailabilityOfficeHoursWillReturnMessage
} from '../../availability/selectors/getAvailabilityOfficeHoursWillReturnMessage';
import {
    getAvailabilityTypicalResponseTimeMessage
} from '../../availability/selectors/getAvailabilityTypicalResponseTimeMessage';
import {
    navigateToStagedThread
} from '../../navigation/actions/navigateToStagedThread';
import {
    getAssignedResponderInWidget
} from '../../responders/selectors/getAssignedResponderInWidget';
import {
    getChatHeadingResponders
} from '../../responders/selectors/getChatHeadingResponders';
import {
    getColoring
} from '../../selectors/widgetDataSelectors/getColoring';
import {
    getSelectedThread
} from '../../selected-thread/selectors/getSelectedThread';
import {
    getIsMobile
} from '../../selectors/getIsMobile';
import {
    calculateUnseenThreadsCountExcludeCurrent
} from '../../threads/selectors/calculateUnseenThreadsCountExcludeCurrent';
import {
    getCanShowThreadHistoryMenu
} from '../../threads/selectors/getCanShowThreadHistoryMenu';
import {
    getShowBackButton
} from '../../threads/selectors/getShowBackButton';
import {
    getWidgetLocation
} from '../../selectors/widgetDataSelectors/getWidgetLocation';
import {
    restorePreviousViewFromKBArticle
} from '../../navigation/actions/restorePreviousViewFromKBArticle';
import {
    navigateToThreadList
} from '../../navigation/actions/navigateToThreadList';
import {
    navigateToKnowledgeBaseArticle
} from '../../navigation/actions/navigateToKnowledgeBaseArticle';
import {
    isCreatingThread
} from '../../thread-create/selectors/stagedThreadSelectors';
import {
    getWidgetSize
} from '../../widget-size/widgetSizeSelectors';
import {
    toggleWidgetSizeForKBArticle
} from '../../kb-article/actions/toggleWidgetSizeForKBArticle';
import {
    getKBArticle,
    getShouldViewKBArticleExpanded
} from '../../kb-article/kbArticleSelectors';
import {
    updateView
} from '../../current-view/actions/updateView';
import {
    getCustomHeaderText
} from '../../current-view/operators/getCustomHeaderText';
import {
    getKBNavigationEnabled
} from '../../navigation/selectors/getKBNavigationEnabled';
import {
    isStarted
} from '../../threads/operators/isStarted';
import {
    isClosed
} from '../../threads/operators/isClosed';
import {
    isPersistedThread
} from '../../threads/operators/isPersistedThread';
import {
    endCurrentThread
} from '../../threads/actions/endCurrentThread';
import {
    getIsUngatedForCloseThread,
    getUseSpotlightLauncher
} from '../../widget-data/selectors/widgetDataSelectors';
import {
    getIsOpen
} from '../../selectors/getIsOpen';
import {
    getIsAIChatbot
} from '../../selectors/widgetDataSelectors/getIsAIChatbot';
import {
    getIsSalesbotChatflow
} from '../../selectors/widgetDataSelectors/getIsSalesbotChatflow';
import {
    getAssignedAgentId
} from '../../threads/operators/threadGetters';
import {
    getIsHumanAgentAssigned
} from '../../responders/selectors/getIsHumanAgentAssigned';
const getEnableAIDisclaimer = (state, selectedThread) => {
    var _getAssignedAgentId;
    const assignedAgentId = (_getAssignedAgentId = getAssignedAgentId(selectedThread)) !== null && _getAssignedAgentId !== void 0 ? _getAssignedAgentId : null;
    if (getIsSalesbotChatflow(state) && !getIsHumanAgentAssigned(state)) {
        return true;
    }
    if (getIsAIChatbot(state) && assignedAgentId === null) {
        return true;
    }
    return false;
};
export const mapStateToProps = state => {
    const kbArticleData = getKBArticle(state);
    const selectedThread = getSelectedThread(state);
    const chatHeadingResponders = getChatHeadingResponders(state);
    return {
        widgetSize: getWidgetSize(state),
        chatHeadingConfig: getChatHeadingConfig(state),
        chatHeadingResponders,
        coloring: getColoring(state),
        customHeaderText: getCustomHeaderText(state),
        isThreadAssigned: Boolean(getAssignedResponderInWidget(state)),
        isThreadStarted: isStarted(selectedThread),
        isThreadClosed: isClosed(selectedThread),
        isThreadPersisted: isPersistedThread(selectedThread),
        mobile: getIsMobile(state),
        officeHoursMessage: getAvailabilityOfficeHoursWillReturnMessage(state),
        showAvailabilityMessage: showAvailabilityMessageInWidget(state, {
            thread: selectedThread
        }),
        showBackButton: getShowBackButton(state),
        backButtonDisabled: isCreatingThread(state),
        typicalResponseTimeMessage: getAvailabilityTypicalResponseTimeMessage(state),
        unseenThreadsCountExcludingCurrentThread: calculateUnseenThreadsCountExcludeCurrent(state),
        widgetLocation: getWidgetLocation(state),
        viewKBArticleExpanded: getShouldViewKBArticleExpanded(state),
        kbArticleDeepLink: kbArticleData.deepLink,
        kbNavigationEnabled: getKBNavigationEnabled(state),
        isUngatedForCloseThread: getIsUngatedForCloseThread(state),
        isSpotlight: getUseSpotlightLauncher(state),
        isWidgetOpen: getIsOpen(state),
        enableAIDisclaimer: getEnableAIDisclaimer(state, selectedThread),
        chatThreadHistoryMenu: getUseSpotlightLauncher(state) && getCanShowThreadHistoryMenu(state) ? SpotlightThreadHistoryMenuContainer : undefined
    };
};
const mapDispatchToProps = {
    fetchAgentResponderIfNecessary: () => {},
    createNewThread: navigateToStagedThread,
    endChat: endCurrentThread,
    republishMessage,
    navigateBack: navigateToThreadList,
    navigateToKnowledgeBaseArticle,
    restorePreviousViewFromKBArticle,
    // Wrapped as a thunk so dispatch receives a function instead of the undefined
    // return value of postMessageToParent, which would throw in Redux.
    onLightboxIsOpen: isOpen => () => handleLightboxStateChange(isOpen),
    toggleWidgetSizeForKBArticle,
    updateView
};
export default connect(mapStateToProps, mapDispatchToProps)(VisitorWidget);