import { Record } from 'immutable';
import { ACTIVITY_TIMELINE_EVENT } from '../constants/messageTypes';
class ActivityTimelineEventRecord extends Record({
  '@type': ACTIVITY_TIMELINE_EVENT,
  id: null,
  etype: '',
  timestamp: null,
  eventData: {}
}, 'ActivityTimelineEventRecord') {
  constructor(props = {}) {
    // Do not use fromJS — eventData must stay a plain object so pill
    // components can access its fields without unwrapping Immutable Maps.
    super(props);
  }
}

// Named type export so deserialize callers can reference the record instance
// type without importing the class constructor — matches the convention used by
// other record types in this library (e.g. ThreadReopenSplitMessageRecord).
export default ActivityTimelineEventRecord;