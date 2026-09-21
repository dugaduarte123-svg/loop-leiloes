const defaultClientData = {
  chatConfig: null,
  client: null,
  connectionInProgress: false,
  forceClientOffline: false,
  isAdmin: true,
  isInForeground: true,
  isPubNubClientConnected: false,
  serverTimeOffsetInMs: 0,
  timestamps: null,
  uuid: null
};
const ClientData = clientDataOptions => Object.assign({}, defaultClientData, clientDataOptions);
export default ClientData;