import PortalIdParser from 'PortalIdParser';
import { PORTAL_53_ID } from '../constants/portal53Ids';
export const getIsPortal53Prod = () => {
  return PortalIdParser.get() === PORTAL_53_ID;
};