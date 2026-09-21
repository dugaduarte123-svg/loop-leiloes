import getIn from 'transmute/getIn';
export const getIsBot = state => {
  return getIn(['widgetData', 'data', 'botResponder', 'bot'], state);
};