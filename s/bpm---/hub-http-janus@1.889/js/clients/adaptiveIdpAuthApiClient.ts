import promiseClient from 'hub-http/adapters/promiseClient';
import { adaptiveIdpAuthStack } from '../stacks/adaptiveIdpAuthApi';
export default promiseClient(adaptiveIdpAuthStack);