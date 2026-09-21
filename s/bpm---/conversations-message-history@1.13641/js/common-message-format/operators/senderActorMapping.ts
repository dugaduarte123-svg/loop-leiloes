import { AGENT, BOT, INTEGRATOR, SYSTEM, VISITOR, EMAIL } from '../constants/legacySenderTypes';
import { AGENT_ACTOR, BOT_ACTOR, INTEGRATOR_ACTOR, SYSTEM_ACTOR, VISITOR_ACTOR, EMAIL_ACTOR } from '../constants/actorTypes';
const actorToSenderMapping = {
  [AGENT_ACTOR]: AGENT,
  [BOT_ACTOR]: BOT,
  [INTEGRATOR_ACTOR]: INTEGRATOR,
  [SYSTEM_ACTOR]: SYSTEM,
  [VISITOR_ACTOR]: VISITOR,
  [EMAIL_ACTOR]: EMAIL
};
const senderToActorMapping = {
  [AGENT]: AGENT_ACTOR,
  [BOT]: BOT_ACTOR,
  [INTEGRATOR]: INTEGRATOR_ACTOR,
  [SYSTEM]: SYSTEM_ACTOR,
  [VISITOR]: VISITOR_ACTOR,
  [EMAIL]: EMAIL_ACTOR
};
export const getSenderFromActorType = actorType => {
  return actorToSenderMapping[actorType] || null;
};
export const getActorFromSenderType = senderType => {
  return senderToActorMapping[senderType] || null;
};