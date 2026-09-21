'use es6';

const newRelicAvailabile = () => Boolean(window.newrelic);
export const MARK_USER_INFO_START = 'mark_user_info_start';
export const MARK_USER_INFO_SUCCESS = 'mark_user_info_success';
export const MEASURE_USER_INFO_TIME = 'measure_user_info_time';
export const MEASURE_API_VERIFY_TIME = 'measure_api_verify_time';
export const setCustomAttribute = (name, value) => {
    if (newRelicAvailabile()) {
        window.newrelic.setCustomAttribute(name, value);
    }
};