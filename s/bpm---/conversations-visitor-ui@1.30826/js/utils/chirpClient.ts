import { createRpcClientV2 } from 'rpc-client-utils';
import http from 'hub-http/clients/apiClient';
const chirpClient = createRpcClientV2({
  hubHttpClient: http
});
export default chirpClient;