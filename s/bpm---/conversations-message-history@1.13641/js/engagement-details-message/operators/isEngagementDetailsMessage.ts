import { ENGAGEMENT_DETAILS_MESSAGE } from '../constants/engagementDetailsMessageType';

//@ts-ignore file not typed
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
export const isEngagementDetailsMessage = message => {
  return getTopLevelType(message) === ENGAGEMENT_DETAILS_MESSAGE;
};