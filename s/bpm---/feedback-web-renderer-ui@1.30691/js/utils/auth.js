'use es6';

export const getCsrfToken = (cookies = window.document.cookie) => {
    const csrfExpression = /csrf.app=([^;]+);?/;
    const csrfResult = csrfExpression.exec(cookies);
    return csrfResult && csrfResult[1];
};
export const buildAuthHeaders = () => ({
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'Content-type': 'application/json',
    'X-HubSpot-CSRF-hubspotapi': getCsrfToken()
});
export const getBaseFeedbackAuthUrl = isQa => {
    const suffix = isQa ? 'qa' : '';
    return `hubspot${suffix}.com/feedback-proxy`;
};