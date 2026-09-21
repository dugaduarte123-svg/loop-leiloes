import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import { ENGAGEMENT_DETAILS_MESSAGE } from '../constants/engagementDetailsMessageType';
import { List, Map as ImmutableMap, Record } from 'immutable';
const EngagementDetailsRecord = Record({
  '@type': ENGAGEMENT_DETAILS_MESSAGE,
  senders: List(),
  timestamp: 0,
  id: '',
  attachments: List(),
  messageDeletedStatus: NOT_DELETED,
  clientType: 'UNKNOWN',
  engagement: ImmutableMap(),
  echo: false,
  ablyTs: 0,
  hiddenFromVisitor: true,
  logRepresentation: '',
  isAsync: false,
  skipThreadReopen: false
}, 'EngagementDetailsRecord');
export default EngagementDetailsRecord;