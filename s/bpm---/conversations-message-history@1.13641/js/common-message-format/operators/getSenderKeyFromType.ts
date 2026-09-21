import { AGENT_SENDER, BOT_SENDER, INTEGRATOR_SENDER, SYSTEM_SENDER, VID_SENDER, VISITOR_SENDER } from '../constants/cmfSenderTypes';
import { ID, UTK, VID } from '../constants/senderIdKeys';
export const getSenderKeyFromType = type => {
  switch (type) {
    case VID_SENDER:
      return VID;
    case VISITOR_SENDER:
      return UTK;
    case BOT_SENDER:
      return ID;
    case AGENT_SENDER:
      return ID;
    case INTEGRATOR_SENDER:
      return ID;
    case SYSTEM_SENDER:
    default:
      return null;
  }
};