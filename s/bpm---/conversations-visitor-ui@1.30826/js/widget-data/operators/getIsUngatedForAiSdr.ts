import PortalIdParser from 'PortalIdParser';
import enviro from 'enviro';
import { getIsPortal53 } from './getIsPortal53';
const AI_SDR_QA_PORTAL_IDS = [913441057];
export const getIsUngatedForAiSdr = () => {
  const portalId = PortalIdParser.get();
  return getIsPortal53() || enviro.isQa() && portalId != null && AI_SDR_QA_PORTAL_IDS.includes(portalId);
};