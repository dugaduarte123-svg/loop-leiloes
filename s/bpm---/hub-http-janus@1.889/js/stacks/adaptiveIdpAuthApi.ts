import { createIdpAuthStack } from './idpAuthApi';
import * as loadBalancers from '../middlewares/loadBalancers';

// Create an IDP auth stack that adaptively routes to tools or private APIs
// based on the current domain and path (tools.hubteam.com or /api/workspace/ → tools API, others → private API)
export const adaptiveIdpAuthStack = createIdpAuthStack(loadBalancers.adaptiveIdpApi);