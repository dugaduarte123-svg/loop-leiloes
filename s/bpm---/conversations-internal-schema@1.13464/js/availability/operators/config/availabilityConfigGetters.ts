import get from 'transmute/get';
import getIn from 'transmute/getIn';
import { AFTER_HOURS_AUTO_REPLY_MESSAGE, ALLOW_VISITOR_MESSAGES_AWAY_IN_OFFICE_HOURS, ALLOW_VISITOR_MESSAGES_WHEN_AGENTS_AWAY, ALLOW_VISITOR_MESSAGES_OUTSIDE_OFFICE_HOURS, AWAY_AUTO_REPLY, AWAY_IN_OFFCE_HOURS_STRATEGY, AWAY_IN_OFFICE_HOURS_AUTO_REPLY, AWAY_MESSAGE, OFFICE_HOURS, OUTSIDE_OFFICE_HOURS_AUTO_REPLY, OUTSIDE_OFFICE_HOURS_MESSAGE, OUTSIDE_OFFICE_HOURS_STRATEGY, TEAM_MEMBERS_AVAILABILITY_STRATEGY, TYPICAL_RESPONSE_TIME } from '../../constants/keyPaths';

// FIXME make getIn type match immutable's
export const getAwayInOfficeHoursStrategy = getIn(AWAY_IN_OFFCE_HOURS_STRATEGY);
export const getAwayMessage = config => getIn(AWAY_MESSAGE, config) || '';
export const getAllowVisitorMessagesAwayInOfficeHours = config => getIn(ALLOW_VISITOR_MESSAGES_AWAY_IN_OFFICE_HOURS, config) || false;
export const getAwayInOfficeHoursAutoReply = config => getIn(AWAY_IN_OFFICE_HOURS_AUTO_REPLY, config) || '';
export const getAllowVisitorMessagesWhenAgentsAway = config => getIn(ALLOW_VISITOR_MESSAGES_WHEN_AGENTS_AWAY, config) || false;
export const getAwayAutoReply = config => getIn(AWAY_AUTO_REPLY, config) || '';
export const getOfficeHours = getIn(OFFICE_HOURS);
export const getOutsideOfficeHoursMessage = config => getIn(OUTSIDE_OFFICE_HOURS_MESSAGE, config) || '';
export const getOutsideOfficeHoursStrategy = getIn(OUTSIDE_OFFICE_HOURS_STRATEGY);
export const getAllowVisitorMessagesOutsideOfficeHours = config => getIn(ALLOW_VISITOR_MESSAGES_OUTSIDE_OFFICE_HOURS, config) || false;
export const getOutsideOfficeHoursAutoReply = config => getIn(OUTSIDE_OFFICE_HOURS_AUTO_REPLY, config) || '';
export const getTeamMembersAvailabilityStrategy = getIn(TEAM_MEMBERS_AVAILABILITY_STRATEGY);
export const getTypicalResponseTime = getIn(TYPICAL_RESPONSE_TIME);
export const getAfterHoursAutoReplyMessage = config => get(AFTER_HOURS_AUTO_REPLY_MESSAGE, config) || '';