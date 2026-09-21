import getIn from 'transmute/getIn';
export const getMessageResultsFromStagedThread = state => {
  return getIn(['stagedThread', 'data', 'messages', 'results'], state);
};