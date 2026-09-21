'use es6';

import {
    AGENT,
    BOT,
    EMAIL,
    INTEGRATOR,
    SYSTEM,
    VISITOR
} from '../constants/legacySenderTypes';
import {
    AGENT_ACTOR,
    BOT_ACTOR,
    EMAIL_ACTOR,
    INTEGRATOR_ACTOR,
    SYSTEM_ACTOR,
    VISITOR_ACTOR
} from '../constants/actorTypes';
const actorSenderMapping = {
    [AGENT_ACTOR]: AGENT,
    [BOT_ACTOR]: BOT,
    [INTEGRATOR_ACTOR]: INTEGRATOR,
    [SYSTEM_ACTOR]: SYSTEM,
    [VISITOR_ACTOR]: VISITOR,
    [EMAIL_ACTOR]: EMAIL
};
const getSenderActorType = actorType => {
    return actorSenderMapping[actorType] || null;
};
export default getSenderActorType;