import get from 'transmute/get';
import { AGENT_ID, AGENT_TYPE, BOT_ID } from '../constants/keyPaths';
export const getAgentId = get(AGENT_ID);
export const getAgentType = get(AGENT_TYPE);
export const getBotId = get(BOT_ID);