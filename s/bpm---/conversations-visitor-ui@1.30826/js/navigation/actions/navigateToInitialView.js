'use es6';

import {
    hasOpenThread
} from '../../threads/selectors/hasOpenThread';
import {
    navigateToMostRecentThread
} from '../../threads/actions/ThreadActions';
import {
    getKnowledgeBaseEnabled
} from '../../selectors/widgetDataSelectors/getKnowledgeBaseEnabled';
import {
    loadStagedThread
} from '../../navigation/actions/loadStagedThread';
import {
    navigateToThreadListKnowledgebase
} from '../../navigation/actions/navigateToThreadListKnowledgebase';
import {
    THREAD_VIEW
} from 'conversations-visitor-experience-components/visitor-widget/constants/views';
export function navigateToInitialView() {
    return (dispatch, getState) => {
        const isKnowledgeBaseWidget = getKnowledgeBaseEnabled(getState());
        if (hasOpenThread(getState())) {
            dispatch(navigateToMostRecentThread());
        } else if (isKnowledgeBaseWidget) {
            dispatch(navigateToThreadListKnowledgebase());
            dispatch(loadStagedThread({
                view: THREAD_VIEW
            }));
        } else {
            dispatch(loadStagedThread());
        }
    };
}