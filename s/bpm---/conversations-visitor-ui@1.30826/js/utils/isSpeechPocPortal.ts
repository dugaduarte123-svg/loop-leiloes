import PortalIdParser from 'PortalIdParser';
import { PORTAL_53_ID, PORTAL_53_QA_ID } from '../widget-data/constants/portal53Ids';
const DEV_PORTAL_IDS = [8237981, 2406023];
const PORTAL_53_SPEECH_POC_IDS = [PORTAL_53_ID, PORTAL_53_QA_ID, ...DEV_PORTAL_IDS];
export const isSpeechPocPortal = () => {
  var _PortalIdParser$get;
  const portalId = (_PortalIdParser$get = PortalIdParser.get()) !== null && _PortalIdParser$get !== void 0 ? _PortalIdParser$get : 0;
  return PORTAL_53_SPEECH_POC_IDS.includes(portalId);
};