import get from 'transmute/get';
import { AUDIT_TYPE, AGENT_TYPE } from '../constants/keyPaths';
export const getType = get(AUDIT_TYPE);
export const getAgentType = get(AGENT_TYPE);