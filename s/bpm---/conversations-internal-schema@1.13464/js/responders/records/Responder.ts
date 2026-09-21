import { Record } from 'immutable';
const Responder = Record({
  activationStatus: null,
  agentState: null,
  agentType: null,
  assignable: true,
  avatar: null,
  bot: false,
  email: null,
  firstName: null,
  lastName: null,
  meetingsLinkText: null,
  meetingsLinkUrl: null,
  online: false,
  salesPro: false,
  userId: null,
  isResponderAI: false,
  jobTitle: null
}, 'Responder');
export default Responder;