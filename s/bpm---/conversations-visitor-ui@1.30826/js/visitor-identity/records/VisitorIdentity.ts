import { Record as ImmutableRecord } from 'immutable';
const defaultValues = {
  globalCookieOptOut: '',
  isFirstVisitorSession: true
};
export default ImmutableRecord(defaultValues, 'VisitorIdentity');