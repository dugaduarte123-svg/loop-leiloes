'use es6';

import {
    consentToProcess
} from '../../gdpr/actions/visitorConsentsToProcess';
import {
    shouldRecordImplicitConsentToProcess
} from '../../gdpr/selectors/shouldRecordImplicitConsentToProcess';
export const applyGdprConsent = () => (dispatch, getState) => {
    if (shouldRecordImplicitConsentToProcess(getState())) {
        dispatch(consentToProcess());
    }
    return Promise.resolve();
};